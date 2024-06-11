import { fetchShopAPI } from "../../api/shop.api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import ConfigInterface from "../../interfaces/config/config.interface";
import ProductInterface from "../../interfaces/product.interface";
import diacritics from 'diacritics';

interface ShopState {
  loading: boolean;
  error: string | null;
  products: ProductInterface[];
  filters: {
    searchQuery: string;
    categoriesIds: string[];
    selectedAllCategories: boolean;
    rentalDates: {
      startDate: Date | null;
      endDate: Date | null;
    };
    pickupLocationsIds: string[];
    priceDayRange: {
      min: number;
      max: number;
    };
  };
  queriedProducts: ProductInterface[];
  queriedConfig?: ConfigInterface;
}

const initialState: ShopState = {
  loading: true,
  error: null,
  products: [],
  filters: {
    searchQuery: '',
    categoriesIds: [],
    selectedAllCategories: false,
    rentalDates: {
      startDate: null,
      endDate: null
    },
    pickupLocationsIds: [],
    priceDayRange: {
      min: 0,
      max: 0
    }
  },
  queriedProducts: [],
  queriedConfig: undefined
}

function filterProducts(state: ShopState) {
  state.products = state.queriedProducts.filter(product => {
    if (state.filters.categoriesIds.length > 0 && !state.filters.categoriesIds.includes(product.category!._id)) {
      return false;
    }

    if (state.filters.pickupLocationsIds.length > 0 && !product.stock!.some(stock => state.filters.pickupLocationsIds.includes(stock.location._id))) {
      return false;
    }

    if (state.filters.searchQuery && !product.lookupNames?.spanish?.some(lookupName => diacritics.remove(lookupName.toLowerCase()).includes(diacritics.remove(state.filters.searchQuery.toLowerCase())))) {
      return false;
    }

    if (product.priceDay! < state.filters.priceDayRange.min || (product.priceDay! > state.filters.priceDayRange.max && state.filters.priceDayRange.max !== 0)) {
      return false;
    }
    
    return true;
  }).map(product => {
    const stock = product.stock!.filter(stock => state.filters.pickupLocationsIds.length === 0 || state.filters.pickupLocationsIds.includes(stock.location._id));

    return {
      ...product,
      stock
    };
  });
}


const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    toggleCategoryFilter(state, action: PayloadAction<string>) {
      const categoryId = action.payload;
      const index = state.filters.categoriesIds.indexOf(categoryId);
      if (index === -1) {
        state.filters.categoriesIds.push(categoryId);
      } else {
        state.filters.categoriesIds.splice(index, 1);
      }

      filterProducts(state);
    },

    toggleLocationFilter(state, action: PayloadAction<string>) {
      const locationId = action.payload;

      if (state.filters.pickupLocationsIds.length === state.queriedConfig!.locations.length && !state.filters.selectedAllCategories) {
        state.filters.pickupLocationsIds = [];
      }

      const index = state.filters.pickupLocationsIds.indexOf(locationId);
      if (index === -1) {
        state.filters.pickupLocationsIds.push(locationId);
        if (state.filters.pickupLocationsIds.length === state.queriedConfig!.locations.length) {
          state.filters.selectedAllCategories = true;
        }
      } else {
        state.filters.pickupLocationsIds.splice(index, 1);
        state.filters.selectedAllCategories = false;
      }

      if (state.filters.pickupLocationsIds.length === 0) {
        state.filters.pickupLocationsIds = state.queriedConfig!.locations.map(location => location._id);
      }

      filterProducts(state);
    },

    setPriceDayRange(state, action: PayloadAction<{ min: string | undefined, max: string | undefined }>) {
      if (action.payload.min) {
        state.filters.priceDayRange.min = parseInt(action.payload.min);
      }
      if (action.payload.max) {
        state.filters.priceDayRange.max = parseInt(action.payload.max);
      }

      filterProducts(state);
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.filters.searchQuery = action.payload;

      filterProducts(state);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchShop.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchShop.fulfilled, (state, action) => {
      const { config, products }: { config: ConfigInterface, products: ProductInterface[] } = action.payload;
      state.loading = false;
      state.queriedConfig = { ...config };
      state.filters.pickupLocationsIds = config.locations.map(location => location._id);
      state.products = products;
      state.queriedProducts = products;
    });
    builder.addCase(fetchShop.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || null;
    });

  }
});

export const fetchShop = createAsyncThunk(
  'shop/fetchShop',
  async () => {
    return await fetchShopAPI();
  }
);

export const {
  toggleLocationFilter,
  toggleCategoryFilter,
  setPriceDayRange,
  setSearchQuery
} = shopSlice.actions;

export default shopSlice.reducer;