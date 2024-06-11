import { Express, Request, Response } from 'express';
const router = require('express').Router();
import validateResource from '../middleware/validateResource';
import { createSessionSchema } from '../schema/session.schema';
import { createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler } from '../controller/session.controller';
import requireUser from '../middleware/requireUser';
import catchAsync from '../utils/catchAsync';

function configRoutes(app: Express) {

  app.use('/sessions', router);

  router.route('/')
    // Create session, equivalent to login
    .post(validateResource(createSessionSchema), catchAsync(createUserSessionHandler))
    // Get sessions
    .get(requireUser, catchAsync(getUserSessionsHandler))
    // Delete session, equivalent to logout
    .delete(requireUser, catchAsync(deleteSessionHandler))

};

export default configRoutes;