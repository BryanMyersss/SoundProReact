import { Express, Request, Response } from 'express';
import { getConfig } from '../service/config.service';
import catchAsync from '../utils/catchAsync';

const router = require('express').Router();

function configRoutes(app: Express) {

  app.use('/config', router);

  router.get('/public', catchAsync(async (req: Request, res: Response) => {
    const config = await getConfig();

    if (!config) {
      return res.status(500).send('Shop config not found');
    }
    const response = {
      categories: config.categories,
      productProps: config.productProps,
      locations: config.locations
    }
    res.json(response);
  }));

  router.get('/product-props-lean', catchAsync(async (req: Request, res: Response) => {
    const config = await getConfig();

    if (!config || !config.productProps) {
      return res.status(500).send('Shop config not found');
    }

    const response = {
      productProps: config.productProps.map(prop => ({
        displayName: prop.displayName,
        propName: prop.propName,
        placeholder: prop.placeholder,
        _id: prop._id
      }))
    };
    res.json(response);
  }));
};

export default configRoutes;