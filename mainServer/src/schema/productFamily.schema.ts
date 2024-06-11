import { z } from 'zod';
import { getConfig } from '../service/config.service';
import { CategoryInput, PropInput, LocationInput } from '../models/appConfig.model';

const createAsyncSchema = async () => {
  const { categories, productProps, locations } = await getConfig() as { categories: CategoryInput[], productProps: PropInput[], locations: LocationInput[]};

  const stockSchema = z.array(z.object({
    location: z.object({
      _id: z.string({
        required_error: 'Location ID is required'
      })
    }).refine(locationObj => {
      const isValid = locations.some(location => {
        const result = location._id?.toString() === locationObj._id;
        return result;
      });
      return isValid;
    }, {
      message: 'Invalid location'
    }),
    qty: z.coerce.number({
      required_error: 'Stock is required'
    }).min(0, 'Stock can\'t be negative')
  })).min(1, 'At least one stock location is required');


  const categorySchema = z.object({
    displayName: z.object({
      default: z.string({
        required_error: 'Category name is required'
      }),
      spanish: z.string().optional(),
      english: z.string().optional()
    }),
    _id: z.string({
      required_error: 'Category ID is required'
    }),
  }).refine(categoryObj => {
    const isValid = categories.some(category => {
      const result = category._id?.toString() === categoryObj._id;
      return result;
    });
    return isValid;
  }, {
    message: 'Invalid category'
  });

  const propsSchema = z.array(z.object({
    prop: z.object({
      _id: z.string({
        required_error: 'Product prop ID is required'
      })
    }).refine(propObj => {
      const isValid = productProps.some(prop => {
        const result = prop._id?.toString() === propObj._id;
        return result;
      });
      return isValid;
    }, {
      message: 'Invalid product prop'
    }),
    propText: z.string({
      required_error: 'Product prop text is required'
    }),
  })).optional();

  const body = {
    body: z.object({
      manufacturer: z.string({}).min(1, 'Manufacturer name can\'t be empty'),

      name: z.string({}).min(1, 'Product name can\'t be empty'),

      priceDay: z.coerce.number({
        required_error: 'Price per day is required'
      }).min(0, 'Price per day can\'t be negative'),

      investedAmount: z.coerce.number({
        required_error: 'Invested amount is required'
      }).min(0, 'Invested amount can\'t be negative'),

      category: categorySchema,

      bulletPoints: z.object({
        spanish: z.array(z.string().min(1, 'Remove empty bulletPoints. You have entered an extra enter probably!')).min(1, 'Spanish bullet points can\'t be empty')
      }),

      properties: propsSchema,

      stock: stockSchema,

      lookupNames: z.object({
        spanish: z.array(z.string().min(1, 'Remove empty lookupNames. You have entered an extra enter probably!')).min(1, 'Spanish lookup names can\'t be empty')
      }),

      // images: z.array(z.string()).optional(),

      discontinued: z.boolean().optional()
    })
  };

  const params = {
    params: z.object({
      productId: z.string({
        required_error: 'Product ID is required'
      })
    })
  };

  const createProductFamilySchema = z.object({
    ...body
  });

  const updateProductFamilySchema = z.object({
    ...body,
    ...params
  });

  const deleteProductFamilySchema = z.object({
    ...params
  });

  const getProductFamilySchema = z.object({
    ...params
  });

  return {
    createProductFamilySchema,
    updateProductFamilySchema,
    deleteProductFamilySchema,
    getProductFamilySchema
  };
};

export default createAsyncSchema;