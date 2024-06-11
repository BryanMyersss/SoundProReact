import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { customAlphabet } from 'nanoid';
import ProductModel, { ProductDocument, ProductInput } from '../models/testproduct.model';

export async function createProduct(input: ProductInput) {
  const nanoid = customAlphabet('0123456789', 5);

  let productId = `product_${nanoid()}`;
  let existingProduct = await ProductModel.findOne({ productId });

  if (existingProduct) {
    let timesRegenerated = 1;
    while (existingProduct) {
      productId = `product_${nanoid()}`;
      existingProduct = await ProductModel.findOne({ productId });
      timesRegenerated++;
      if (timesRegenerated > 10) {
        throw new Error('Could not generate unique productId');
      }
    }
  }

  return ProductModel.create({ ...input, productId })
}

export async function findProduct(query: FilterQuery<ProductDocument>, options: QueryOptions = { lean: true }) {
  return ProductModel.findOne(query, {}, options)

}

export async function findAndUpdateProduct(
  query: FilterQuery<ProductDocument>, update: UpdateQuery<ProductDocument>, options: QueryOptions
) {
  return ProductModel.findOneAndUpdate(query, update, options)
}

export async function deleteProduct(query: FilterQuery<ProductDocument>) {
  return ProductModel.deleteOne(query)
}
