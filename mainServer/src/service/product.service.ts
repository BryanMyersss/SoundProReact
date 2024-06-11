import { ProductInput } from "../models/productFamily.model";
import { getConfig } from "./config.service";
import { ConfigInput } from "../models/appConfig.model";
import ProductFamily from "../models/productFamily.model";

export function formatProduct(product: ProductInput, config: ConfigInput) {
  try {
    if (!config.categories || !config.productProps) throw new Error('Error formatting product, missing config data');

    const category = config.categories.find(category => category._id?.toString() === product.categoryId);

    const formattedProperties = product.properties.map((property) => {
      const prop = config.productProps!.find(prop => prop._id?.toString() === property.propId);
      return {
        prop: {
          ...prop,
          placeholder: undefined,
          lookupNames: undefined,
        },
        propText: property.propText
      }
    })

    const formattedStock = product.stock.map((stock) => {
      const location = config.locations?.find(location => location._id?.toString() === stock.locationId);
      return {
        location,
        qty: stock.qty
      }
    })
  
    return {
      ...product,
      category,
      stock: formattedStock,
      categoryId: undefined,
      properties: formattedProperties
    }
  } catch (error) {
    throw new Error('Error formatting product');
  }
}

export function formatProductMultiple(products: ProductInput[], config: ConfigInput) {
  return products.map(product => formatProduct(product, config));
}

export async function getAllProducts() {
  const config = await getConfig();
  if (!config) throw new Error('Error getting config data');

  const products = await ProductFamily.find().lean();
  
  const formatedProducts = formatProductMultiple(products!, config);

  return formatedProducts;
}