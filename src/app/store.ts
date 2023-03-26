import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import {dashboardReducer} from "../utils/db";
import globalConfigReducer from "../routes/App/globalConfigSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    dashboard: dashboardReducer,
    globalConfig: globalConfigReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
