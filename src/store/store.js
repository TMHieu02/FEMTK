import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import productReducer from './slices/product-slice';
import currencyReducer from './slices/currency-slice';
import cartReducer from './slices/cart-slice';
import compareReducer from './slices/compare-slice';
import wishlistReducer from './slices/wishlist-slice';
import userLevelsReducer from './slices/user-levels-slice';
import storeLevelsReducer from './slices/store-levels-slice';
import deliveriesReducer from './slices/deliveries-slice';
import commissionsReducer from './slices/commissions-slice';
import categoriesReducer from './slices/categories-slice';
import usersReducer from './slices/users-slice';
import ordersReducer from './slices/orders-slice';
import storesReducer from './slices/stores-slice';
import statisticReducer from './slices/statistics-slice';
import productVendorReducer from './slices/product-vendor-slice';
import userOdersReducer from './slices/userOders-slice';

import authReducer from './slices/auth-slice';

const persistConfig = {
  key: 'flone',
  version: 1.1,
  storage,
};

export const rootReducer = combineReducers({
  product: productReducer,
  currency: currencyReducer,
  cart: cartReducer,
  compare: compareReducer,
  wishlist: wishlistReducer,
  userLevels: userLevelsReducer,
  storeLevels: storeLevelsReducer,
  deliveries: deliveriesReducer,
  commissions: commissionsReducer,
  categories: categoriesReducer,
  users: usersReducer,
  stores: storesReducer,
  statistics: statisticReducer,
  productVendors: productVendorReducer,
  orders: ordersReducer,
  auth: authReducer,
  userOrders: userOdersReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ['payload.headers'],
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
