import { Request, Response } from 'express';
import { omit } from 'lodash';
import { createUser } from '../service/user.service';
import { CreateUserInput } from '../schema/user.schema';
import { createSession } from '../service/session.service';
import { signJwt } from '../utils/jwt.utils';
import config from 'config';
import { getConfigAdmins } from '../service/config.service';

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput['body']>,
  res: Response
) {
  try {
    const user = await createUser(req.body);
    
    // Create a session
    const session = await createSession(user._id, req.get('user-agent') || "")

    // Create an access token
    const accessToken = signJwt(
      { ...user, session: session._id },
      { expiresIn: config.get('accessTokenTtl') } // 15 minutes
    )

    // Create a refresh token
    const refreshToken = signJwt(
      { ...user, session: session._id },
      { expiresIn: config.get('refreshTokenTtl') } // 1 year
    )

    res.cookie('accessToken', accessToken, {
      maxAge: 1000 * 60 * 15, // 15 minutes
      httpOnly: true,
      domain: config.get('domain'),
      path: '/',
      sameSite: 'strict',
      secure: (config.get('production') ? true : false)
    });

    res.cookie('refreshToken', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      domain: config.get('domain'),
      path: '/',
      sameSite: 'strict',
      secure: (config.get('production') ? true : false)
    });

    let isAdmin = false;
    const admins = await getConfigAdmins();
    if (admins) isAdmin = admins.includes(user._id);
    
    const userPayload = {
      ...omit(user, "password"),
      isAdmin
    }
    return res.send(userPayload);
  } catch (e: any) {
    return res.status(409).send(e.message)
  }
}

export async function getCurrentUserHandler(req: Request, res: Response) {
  return res.send(res.locals.user);
}