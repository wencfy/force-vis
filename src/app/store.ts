import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import {dashboardReducer} from "../routes/DashboardManager/dashboardManagerSlice";
import {datasourceReducer} from "../routes/DatasourceManager/datasourceManagerSlice";
import globalConfigReducer from "../routes/App/globalConfigSlice";

export const store = configureStore({
  reducer: {
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
