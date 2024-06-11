import { Request, Response } from 'express';
import config from 'config';
import { validatePassword } from '../service/user.service';
import { createSession, deleteSession, findSessions, updateSession } from '../service/session.service';
import { signJwt } from '../utils/jwt.utils';
import { omit } from 'lodash';
import { isAdmin } from '../service/user.service';
import { UserDocument } from '../models/user.model';

// Equivalent to login
export async function createUserSessionHandler(req: Request, res: Response) {

  // Validate the user's password
  const user = await validatePassword(req.body)
  if (!user) {
    return res.status(401).send('Invalid email or password');
  }

  // Create a session
  const session = await createSession(user._id, req.get('user-agent') || "")

  // Create an access token
  const accessToken = signJwt(
    { ...user, session: session._id, isAdmin: await isAdmin(user as UserDocument)},
    { expiresIn: config.get('accessTokenTtl') } // 15 minutes
  )

  // Create a refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get('refreshTokenTtl') } // 1 year
  )

  res.cookie('accessToken', accessToken,{
    maxAge: 1000 * 60 * 15, // 15 minutes
    httpOnly: true,
    domain: config.get('domain'),
    path: '/',
    sameSite: 'strict',
    secure: (config.get('production') ? true : false)
  });
  
  res.cookie('refreshToken', refreshToken,{
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    httpOnly: true,
    domain: config.get('domain'),
    path: '/',
    sameSite: 'strict',
    secure: (config.get('production') ? true : false)
  });

  const userData = {
    ...omit(user, 'password'),
    isAdmin: await isAdmin(user as UserDocument)
  }

  // return acces & refresh tokens
  return res.send({ accessToken, refreshToken, user: userData})
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id

  const sessions = await findSessions({user: userId, valid: true})

  return res.send(sessions);
}

// Equivalent to logout
export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  // await updateSession({_id: sessionId}, {valid: false})
  await deleteSession({_id: sessionId})

  res.clearCookie('accessToken', {
    httpOnly: true,
    domain: config.get('domain'),
    path: '/',
    sameSite: 'strict',
    secure: config.get('production') ? true : false
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    domain: config.get('domain'),
    path: '/',
    sameSite: 'strict',
    secure: config.get('production') ? true : false
  });

  return res.send({
    accessToken: null,
    refreshToken: null
  })
}
