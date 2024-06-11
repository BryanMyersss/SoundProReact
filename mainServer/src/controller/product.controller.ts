import { Request, Response } from 'express';
import validateResourceAsync from '../middleware/validateResourceAsync';
import { parseToJSON } from '../middleware/parseToJSON';
import productFamilySchema from '../schema/productFamily.schema';
import { uploadImage } from '../utils/s3';
import ProductFamily from '../models/productFamily.model';
import { getAllProducts } from '../service/product.service';
import { getConfig } from '../service/config.service';
import config from 'config';
import Cooldown from '../models/cooldown.model';

import { FileToWebp } from '../utils/imageConverter';

/**
 * @description Use only after calling multer middleware, so that req.file and req.body are parsed
 * @param req
 * @param res
  */

export const createProductHandler = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).send('No file uploaded.')

  // Converts the properties that were stringified in the client, back to JSON
  parseToJSON(['category', 'bulletPoints', 'properties', 'stock', 'lookupNames'], req, res);

  // This line below is amazing.
  await validateResourceAsync('createProductFamilySchema', productFamilySchema, false)(req, res)

  // Convert to webp
  const webpBuffer = await FileToWebp(req.file.buffer);

  const { response, url } = await uploadImage({ buffer: webpBuffer, uploadPath: 'public/product-images/', ContentType: 'image/webp' })

  const formattedProperties = req.body.properties.map((property: any) => {
    return {
      propId: property.prop._id,
      propText: property.propText,
    }
  })

  const formattedStock = req.body.stock.map((stock: any) => {
    return {
      locationId: stock.location._id,
      qty: stock.qty
    }
  })

  const product = new ProductFamily({
    ...req.body,
    stock: formattedStock,
    properties: formattedProperties,
    categoryId: req.body.category._id,
    images: [url]
  });

  await product.save();

  res.send({ imageLink: url, response })
}

export const getProductsHandler = async (req: Request, res: Response) => {
  const products = await getAllProducts();
  res.send(products)
}

import OpenAI from 'openai';
import createWithAiPrompt from '../constants/createWithAiPrompt'

// OpenAI
const openai = new OpenAI({
  apiKey: config.get<string>('openaiSecretKey'), // This is the default and can be omitted
});

export const createWithAiHandler = async (req: Request, res: Response) => {
  const cooldown = await Cooldown.findOne({});
  const cooldownSeconds = config.get<number>('aiCooldownSeconds');
  if (cooldown) {
    const date = new Date(cooldown.date);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    // console.log(cooldown)
    if (diff < cooldownSeconds * 1000) {
      return res.send({ data: { error: { message: `This feature is on cooldown. Please wait ${cooldownSeconds - Math.floor(diff / 1000)} seconds.` } } });
    }
  }
  if (!cooldown) {
    await new Cooldown({}).save();
  }

  const { rawData } = req.body;
  const configData = await getConfig();
  if (!configData) return res.status(400).send('No config found')
  const { categories, productProps } = configData;
  if (!categories || !productProps) return res.status(400).send('No categories or props found')

  const formatedCategories = categories.map((category: any) => {
    return `${category.displayName.default} - ${category._id}`
  })

  const formatedProductProps = productProps.map((prop: any) => {
    return `${prop.propName} - ${prop.description} - ${prop.displayName.default} - ${prop.placeholder.default} - ${prop._id}`
  })

  const userPrompt = `
User scraped data: ${JSON.stringify(rawData, null, 2)}
Categories format: (category name - id)
Categories list: ${JSON.stringify(formatedCategories, null, 2)}
Product props format: (propName - description - displayName - placeholder - id)
Product props list: ${JSON.stringify(formatedProductProps, null, 2)}
`;

  // console.log(userPrompt)

  cooldown!.date = new Date();
  await cooldown!.save();

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: createWithAiPrompt.systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }],
      model: 'gpt-4o',
      max_tokens: 4095,
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    res.status(200).send({
      success: true,
      data: chatCompletion
    })
  } catch (error: any) {
    res.send({
      success: false,
      data: error
    })
  }
}