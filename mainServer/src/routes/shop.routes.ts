import { Express, Request, Response } from 'express';
import { getShopHandler } from '../controller/shop.controller';
import catchAsync from '../utils/catchAsync';
const router = require('express').Router();

function shopRoutes(app: Express) {

  app.use('/shop', router);

  router.route('/')
    .get(catchAsync(getShopHandler))

};

export default shopRoutes;