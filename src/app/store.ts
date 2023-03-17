import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import dashboardManagerReducer from "../routes/DashboardManager/dashboardManagerSlice";
import globalConfigReducer from "../routes/App/globalConfigSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    dashboards: dashboardManagerReducer,
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
