import mongoose from "mongoose";

export interface ProductInput {
  manufacturer: string;
  name: string;
  priceDay: number;
  investedAmount: number;
  categoryId: string;
  bulletPoints: { spanish: string[] };
  properties: { propId: string, propText: String }[];
  stock: { locationId: string, qty: number }[];
  images: string[];
  discontinued: boolean;
  lookupNames: { spanish: string[] };
}

export interface ProductDocument extends ProductInput, mongoose.Document { }

const productFamilySchema = new mongoose.Schema({
  manufacturer: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  priceDay: {
    type: Number,
    required: true
  },
  investedAmount: {
    type: Number,
    required: true
  },
  categoryId: String,
  bulletPoints: {
    spanish: [String]
  },
  properties: [{
    propId: String,
    propText: String
  }],
  images: [String],
  discontinued: {
    type: Boolean,
    default: false
  },
  stock: [Object],
  lookupNames: {
    spanish: [String]
  }
}, {
  timestamps: true
});

const ProductFamilyModel = mongoose.model<ProductDocument>('ProductFamily', productFamilySchema);

export default ProductFamilyModel;
