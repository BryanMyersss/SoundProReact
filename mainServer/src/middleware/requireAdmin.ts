import { Request, Response, NextFunction } from "express";
import { getConfigAdmins } from "../service/config.service";

async function requireAdminMiddleware(req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;
  if (!user) return res.status(401).send('Unauthorized');
  const admins = await getConfigAdmins();
  if (!admins) return res.status(500).send('Internal Server Error');
  if (!admins.includes(user._id)) return res.status(403).send('Forbidden, you are not an admin');
  next();
}

export default requireAdminMiddleware;
