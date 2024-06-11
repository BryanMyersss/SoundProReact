import { Express, Request, Response } from 'express';
const router = require('express').Router();
import validateResource from '../middleware/validateResource';
import { createUserSchema } from '../schema/user.schema';
import { createUserHandler, getCurrentUserHandler } from '../controller/user.controller';
import requireUser from '../middleware/requireUser';
import catchAsync from '../utils/catchAsync';

function configRoutes(app: Express) {

  app.use('/user', router);

  router.route('/')
    // Register Route
    .post(validateResource(createUserSchema), catchAsync(createUserHandler))
    .get(requireUser, catchAsync(getCurrentUserHandler));
};

export default configRoutes;