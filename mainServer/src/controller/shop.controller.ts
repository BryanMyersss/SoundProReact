import { Request, Response } from 'express';
import { getAllProducts } from '../service/product.service';
import { getConfig } from '../service/config.service';
import { omit } from 'lodash';


export async function getShopHandler(req: Request, res: Response) {
  const products = await getAllProducts();
  const config = await getConfig();
  if (!config) {
    return res.status(500).send({ message: 'Error fetching config' });
  }
  const formattedConfig = omit(config, 'admins');
  res.send({ products, config: formattedConfig });
}