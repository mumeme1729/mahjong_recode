import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../components/auth/authSlice';
import homeReducer from '../components/home/homeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    home: homeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export type AppDispatch =typeof store.dispatch;