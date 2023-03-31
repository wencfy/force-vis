import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import {dashboardReducer} from "../routes/DashboardManager/dashboardManagerSlice";
import {datasourceReducer} from "../routes/DatasourceManager/datasourceManagerSlice";
import globalConfigReducer from "../routes/App/globalConfigSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    dashboard: dashboardReducer,
    datasource: datasourceReducer,
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
