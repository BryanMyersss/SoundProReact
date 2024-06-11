import { Express } from 'express'
import shopRoutes from './routes/shop.routes'
import productRoutes from './routes/product.routes'
import configRoutes from './routes/config.routes';
import userRoutes from './routes/user.routes';
import sessionRoutes from './routes/session.routes';
import testproductRoutes from './routes/testproduct.routes';
import imageRoutes from './routes/image.routes';

function routes(app: Express) {
  shopRoutes(app);  
  productRoutes(app);
  configRoutes(app);
  userRoutes(app);
  sessionRoutes(app);
  imageRoutes(app);
}

export default routes;