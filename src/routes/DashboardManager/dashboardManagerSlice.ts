import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {DashboardList, getDashboardList, GetDashboardListPayload} from "../../utils";
import {RootState} from "../../app/store";
import {ListViewData} from "../../app/types";

export interface DashboardManagerState extends ListViewData {
  locationInfo: Record<string, {
    name: string;
    kind: "folder";
    url: string;
  }>;
}

const initialState: DashboardManagerState = {
  status: "idle",
  locationInfo: {},
  values: []
}

export const getDashboardsAsync = createAsyncThunk(
  'dashboards/getDashboards',
  async (payload?: GetDashboardListPayload) => {
    const response: DashboardList = await getDashboardList(payload);
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const dashboardManagerSlice = createSlice({
  name: 'dashboards',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardsAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getDashboardsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.locationInfo = action.payload.schema.meta.locationInfo;
        state.values = action.payload.values;
      })
  }
});

export const selectFolders = (state: RootState) => {
  const { status, values } = state.dashboards;
  return {
    status,
    values: values.filter((value) => {
      return value[0] === 'folder';
    })
  };
};

export const selectDashboardsByFolder = (folder: string) => {
  return (state: RootState) => {
    const { values } = state.dashboards;
    return values.filter((value) => {
      return value[0] === 'dashboard' && value[5] === folder;
    })
  };
}

export default dashboardManagerSlice.reducer;
