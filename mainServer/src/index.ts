import express, { Request, Response, NextFunction, Errback } from 'express';
import config from 'config';
import routes from './routes';
import cookieParser from 'cookie-parser';
import connect from './utils/connect';
import cors from 'cors';
import deserializeUser from './middleware/deserializeUser';

const app = express();
const port = config.get<number>('port');

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: config.get<string>('origin'),
  credentials: true
}));
app.use(deserializeUser);

app.use(async (req, res, next) => {
  // console.log('Middleware ran');
  next();
});

// const startTime = performance.now();
// console.log('Starting server setup...')
// await fetchCategories(); // Fetch categories and store em to locals before starting the server (to do with redis)

// const endTime = performance.now();
// console.log(`Server setup finished in ${Math.floor(endTime - startTime)}ms`);

app.listen(port, async () => {

  await connect();

  console.log(`Server is running on http://localhost:${port}`);

  routes(app); // Pass the app to routes

  app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    if (!err.message) err.message = 'Something went wrong!'
    res.status(500).send(err.message)
  })
});

