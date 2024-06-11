import LocationInterface from "./config/location.interface";
import PropInterface from "./config/prop.interface";

export interface DisplayName {
  default: string,
  spanish?: string,
  english?: string
}

export interface StockInterface {
  location: LocationInterface;
  qty?: number;
}

export default interface ProductInterface {
  category?: {
    displayName: DisplayName,
    _id: string
  };
  images?: string[];
  stock?: StockInterface[];
  manufacturer?: string;
  name?: string;
  priceDay?: number;
  properties?: { prop: PropInterface, propText: string }[];
  bulletPoints?: { spanish: string[] };
  lookupNames?: { spanish?: string[] };
  _id?: string;
}