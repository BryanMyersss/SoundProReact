import { get } from "lodash"
import config from "config"
import { Request, Response, NextFunction } from "express"
import { verifyJwt } from "../utils/jwt.utils";
import { reIssueAccessToken } from "../service/session.service";

// Checks if the user has a correct and non expired access token, equivalent to checking if the user is logged in,
// However, it does not check whether the corresponding sesion in db is expired or not, that is done in session.service reIssueAccessToken

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken =
    get(req, 'cookies.accessToken') ||
    get(req, 'headers.authorization', '').replace(/^Bearer\s/, '') as string;

  const refreshToken =
    get(req, 'cookies.refreshToken') ||
    get(req, "headers.x-refresh") as string;

  if (!accessToken && !refreshToken) {
    return next();
  }

  const { decoded , expired } = verifyJwt(accessToken);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if ((expired && refreshToken) || (!accessToken && refreshToken)) {
    const newAccessToken = await reIssueAccessToken({ refreshToken }) as string;

    if (newAccessToken) {
      res.setHeader('x-access-token', newAccessToken)

      res.cookie('accessToken', newAccessToken, {
        maxAge: 1000 * 60 * 15, // 15 minutes
        httpOnly: true,
        domain: config.get('domain'),
        path: '/',
        sameSite: 'strict',
        secure: (config.get('production') ? true : false)
      });
    }

    const result = verifyJwt(newAccessToken);

    res.locals.user = result.decoded;
    return next();
  }

  return next();
}

export default deserializeUser;