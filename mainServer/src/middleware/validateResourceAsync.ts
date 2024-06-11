import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

// Define the type for the asyncSchema function
type AsyncSchema = () => Promise<{ [key: string]: AnyZodObject }>;

const validateResourceAsync = (schemaName: string, asyncSchema: AsyncSchema, middleware = true) => async (req: Request, res: Response, next?: NextFunction) => {
  try {
    // Await the schemas from the asyncSchema function
    const schemas = await asyncSchema();
    const schema = schemas[schemaName];

    // Ensure the schema exists
    if (!schema) {
      return res.status(400).send({ message: `Schema ${schemaName} not found` });
    }

    // Parse the request using the selected schema
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params
    });

    // Call the next middleware if validation is successful
    if (middleware) next!();
  } catch (e: any) {
    // Send validation errors as response
    if (middleware) return res.status(400).send(e.errors);
    throw new Error(e);
  }
};

export default validateResourceAsync;
