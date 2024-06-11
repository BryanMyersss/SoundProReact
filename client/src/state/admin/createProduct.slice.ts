import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import props from '../../data/productProps';
import { fetchShopConfigAPI } from "../../api/config.api";
import { createWithAiAPI } from "../../api/openAi.api";

import LocationInterface from "../../interfaces/config/location.interface";
import CategoryInterface from "../../interfaces/config/category.interface";
import PropInterface from "../../interfaces/config/prop.interface";

export interface CreateProductState {
  manufacturer: string;
  name: string;
  priceDay: number | undefined;
  investedAmount: number | undefined;
  category?: CategoryInterface;
  properties: { prop: PropInterface, propText: string }[];
  stock: { qty?: number, location: LocationInterface }[];
  bulletPoints: { spanish: string[] };
  lookupNames: { spanish?: string[] }
  queriedProps: PropInterface[];
  queriedCategories: CategoryInterface[];
  queriedLocations: Array<LocationInterface>;
  base64image: string | undefined;
  imageLink: string | undefined;
  aiCreator?: {
    productObj?: object;
    message?: string;
    loading: boolean;
  }
}

const initialState: CreateProductState = {
  manufacturer: '',
  name: '',
  priceDay: undefined,
  investedAmount: undefined,
  category: undefined,
  properties: [],
  stock: [],
  bulletPoints: { spanish: [] },
  lookupNames: {},
  queriedProps: [],
  queriedCategories: [],
  queriedLocations: [],
  base64image: undefined,
  imageLink: undefined,
  aiCreator: undefined
}

// THIS IS HOW IT SHOULD BE DONE, TODO: ADD TYPES
// setManufacturer(state, action: PayloadAction<string>) {
//   state.manufacturer = action.payload;
// },

const createProductSlice = createSlice({
  name: 'createProduct',
  initialState,
  reducers: {
    setManufacturer(state, action) {
      state.manufacturer = action.payload;
    },
    setName(state, action) {
      state.name = action.payload;
    },
    setPriceDay(state, action) {
      state.priceDay = action.payload;
    },
    setInvestedAmount(state, action) {
      state.investedAmount = action.payload;
    },
    setCategory(state, action: PayloadAction<string>) {
      const _id = action.payload;
      const category = state.queriedCategories.find((category: any) => category._id === _id) as CreateProductState['category'];
      if (category) {
        state.category = category;
      }
    },
    removeCategory(state) {
      state.category = undefined;
    },

    addProp(state, action) {
      const _id = action.payload as string;
      const prop = state.queriedProps.find((prop: any) => prop._id === _id);
      const alreadyAdded = state.properties.find((propObject: any) => propObject.prop._id === _id);
      if (prop && !alreadyAdded) {
        const propObject = {
          prop,
          propText: ''
        } as { prop: PropInterface, propText: string };
        state.properties.push(propObject);
      }
    },
    deleteProp(state, action) {
      const _id = action.payload as string;
      const propIndex = state.properties.findIndex((propObject: any) => propObject.prop._id === _id);
      if (propIndex !== -1) {
        state.properties.splice(propIndex, 1);
      }
    },
    setPropText(state, action) {
      const { _id, text } = action.payload;
      const propIndex = state.properties.findIndex((propObject: any) => propObject.prop._id === _id);
      if (propIndex !== -1) {
        state.properties[propIndex].propText = text;
      }
    },

    setBulletPoints(state, action) {
      state.bulletPoints.spanish = action.payload.split('\n');
    },

    setLookupNames(state, action: PayloadAction<{ language: keyof CreateProductState['lookupNames'], value: string }>) {
      const { language, value } = action.payload;
      state.lookupNames[language] = value.split('\n');
    },

    addStock(state, action: PayloadAction<String>) {
      const _id = action.payload;
      const location = state.queriedLocations.find((location: any) => location._id === _id) as LocationInterface;
      const alreadyAdded = state.stock.find((stock: any) => stock.location._id === _id);

      if (location && !alreadyAdded) {
        state.stock.push({ qty: undefined, location });
      }
    },
    setStockQty(state, action: PayloadAction<{ qty: number, _id: string }>) {
      const { qty, _id } = action.payload;
      const stockIndex = state.stock.findIndex((stock: any) => stock.location._id === _id);
      if (stockIndex !== -1) {
        state.stock[stockIndex].qty = qty;
      }
    },
    deleteStock(state, action: PayloadAction<string>) {
      const _id = action.payload;
      const stockIndex = state.stock.findIndex((stock: any) => stock.location._id === _id);
      if (stockIndex !== -1) {
        state.stock.splice(stockIndex, 1);
      }
    },

    setBase64Image(state, action) {
      state.base64image = action.payload;
    },
    setImageLink(state, action) {
      state.imageLink = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShopConfig.pending, () => {
        console.log('fetchShopConfig pending');
      })
      .addCase(fetchShopConfig.fulfilled, (state, action) => {
        const { categories, productProps, locations } = action.payload;
        if (categories) state.queriedCategories = categories;
        if (productProps) state.queriedProps = productProps;
        if (locations) state.queriedLocations = locations;
      })
      .addCase(fetchShopConfig.rejected, () => {
        console.log('fetchShopConfig rejected');
      })

      // AI CREATOR
      .addCase(createWithAi.pending, (state) => {
        state.aiCreator = {
          productObj: {},
          message: '',
          loading: true
        }
      })
      .addCase(createWithAi.fulfilled, (state, action) => {
        state.aiCreator = {
          productObj: action.payload.productObj,
          message: action.payload.message,
          loading: false
        }

        interface propertyFromAIInterface {
          propId: string;
          propText: string;
        }
        try {
          const { bulletPoints, categoryId, investedAmount, priceDay, manufacturer, name, lookupNames } = action.payload.productObj;
          const properties = action.payload.productObj.properties as propertyFromAIInterface[];

          state.bulletPoints = bulletPoints;
          state.lookupNames = lookupNames;
          state.investedAmount = investedAmount;
          state.priceDay = priceDay;
          state.manufacturer = manufacturer;
          state.name = name;
          state.category = state.queriedCategories.find((category: any) => category._id === categoryId) as CreateProductState['category'];

          state.properties = [];
          properties.forEach((property: { propId: string, propText: string }) => {
            const { propId, propText } = property;
            const prop = state.queriedProps.find((prop: any) => prop._id === propId);
            const alreadyAdded = state.properties.find((propObject: any) => propObject.prop._id === propId);
            if (prop && !alreadyAdded) {
              const propObject = {
                prop,
                propText
              } as { prop: PropInterface, propText: string };
              state.properties.push(propObject);
            }
          });

        } catch (error) {
          console.log(error)
        }
      })
      .addCase(createWithAi.rejected, (state, action) => {
        state.aiCreator = {
          productObj: {},
          message: `Error creating product with AI ${action.error.message}`,
          loading: false
        }
      })

  },
});

export const fetchShopConfig = createAsyncThunk(
  "createProduct/fetchShopConfig",
  async () => {
    return await fetchShopConfigAPI();
  }
)

export const createWithAi = createAsyncThunk(
  "createProduct/createWithAi",
  async (rawData: string) => {
    return await createWithAiAPI(rawData);
  }
)

export const {
  setManufacturer,
  setName,
  setPriceDay,
  setInvestedAmount,
  setCategory,
  addProp,
  deleteProp,
  setPropText,
  setBulletPoints,
  setBase64Image,
  setImageLink,
  addStock,
  setStockQty,
  deleteStock,
  removeCategory,
  setLookupNames
} = createProductSlice.actions;

export default createProductSlice.reducer;