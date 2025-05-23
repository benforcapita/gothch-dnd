import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import miniatureReducer from './slices/miniatureSlice';
import battleReducer from './slices/battleSlice';
import userReducer from './slices/userSlice';
import { api } from './api';

export const store = configureStore({
  reducer: {
    miniatures: miniatureReducer,
    battles: battleReducer,
    user: userReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 