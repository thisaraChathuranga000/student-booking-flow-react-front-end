import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import bookingReducer from './slices/bookingSlice';
import bookingFlowReducer from './slices/bookingFlowSlice';
import adminReducer from './slices/adminSlice';
import adminDashboardReducer from './slices/adminDashboardSlice';
import adminLoginReducer from './slices/adminLoginSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['admin'], // Only persist admin authentication state
};

// Combine reducers
const rootReducer = combineReducers({
  booking: bookingReducer,
  bookingFlow: bookingFlowReducer,
  admin: adminReducer,
  adminDashboard: adminDashboardReducer,
  adminLogin: adminLoginReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
          'bookingFlow/setDate', 
          'bookingFlow/setScheduled'
        ],
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        ignoredStatePaths: ['bookingFlow.date', 'bookingFlow.scheduled'],
      },
    }),
});

export const persistor = persistStore(store);
