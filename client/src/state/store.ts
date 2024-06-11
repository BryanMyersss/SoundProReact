import {configureStore} from '@reduxjs/toolkit';
import shopReducer from './shop/shop.slice';
import createProducReducer from './admin/createProduct.slice';
import uiReducer from './ui/ui.slice';
import userReducer from './user/user.slice';

export const store = configureStore({
  reducer: {
    shop: shopReducer,
    createProduct: createProducReducer,
    ui: uiReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

