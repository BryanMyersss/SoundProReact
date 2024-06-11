import express, { Express, Request, Response } from 'express';
import requireUser from '../middleware/requireUser';
import { createProductHandler, getProductsHandler, createWithAiHandler } from '../controller/product.controller';
import requireAdmin from '../middleware/requireAdmin';
import catchAsync from '../utils/catchAsync';

// Multer
import multer from 'multer';
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


// Router
const router = express.Router();

function productRoutes(app: Express) {

  app.use('/products', router);

  router.route('/')
    .post([requireUser, requireAdmin, upload.single('image')], catchAsync(createProductHandler))
    .get(catchAsync(getProductsHandler))

  router.route('/create-with-ai')
    .post([requireUser, requireAdmin], catchAsync(createWithAiHandler));

};

export default productRoutes;

