import { Express, Request, Response } from 'express';
import requireUser from '../middleware/requireUser';
import validateResource from '../middleware/validateResource';
import { createProductSchema, deleteProductSchema, getProductSchema, updateProductSchema } from '../schema/testproduct.schema';
import { createProductHandler, deleteProductHandler, getProductHandler, updateProductHandler } from '../controller/testproduct.controller';
const router = require('express').Router();

function productRoutes(app: Express) {

  app.use('/testproducts', router);

  router.route('/')
  .post([requireUser, validateResource(createProductSchema)], createProductHandler)
  
  router.route('/:productId')
  .put([requireUser, validateResource(updateProductSchema)], updateProductHandler)
  .get(validateResource(getProductSchema), getProductHandler)
  .delete([requireUser, validateResource(deleteProductSchema)], deleteProductHandler)
};

export default productRoutes;