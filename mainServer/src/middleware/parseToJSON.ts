import { Request, Response, NextFunction } from "express";

export const parseToJSONMiddleware = (keys: Array<string>) => (req: Request, res: Response, next: NextFunction) => {
    for (const key of keys) {
      if (req.body[key]) {
        try {
          req.body[key] = JSON.parse(req.body[key]);
        } catch (error) {
          console.error(`Error parsing ${key} to JSON`);
          res.status(400).send({ message: `Server Error parsing "${key}" to JSON` });
          return;  // Early return to stop further execution
        }
      }
    }
    
    next();  // Proceed to next middleware only if no errors
}

export const parseToJSON = (keys: Array<string>, req: Request, response: Response) => {
    for (const key of keys) {
      if (req.body[key]) {
        try {
          req.body[key] = JSON.parse(req.body[key]);
        } catch (error) {
          console.error(`Error parsing ${key} to JSON`);
          throw new Error(`Server Error parsing "${key}" to JSON`);
        }
      }
    }
    
    return req.body;
}