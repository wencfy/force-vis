import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {db, Dashboard} from "./index";
import {RootState} from "../../app/store";
import {DataViewState} from "../../components";

interface DashboardManagerState extends DataViewState<Dashboard> {

}

const initialState: DashboardManagerState = {
  status: "idle",
  values: [],
}

export const getDashboardsAsync = createAsyncThunk(
  'dashboard/getDashboards',
  async () => {
    const response = await db.data<Dashboard, 'getAll'>('dashboard', 'getAll');
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const dashboardManagerSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardsAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getDashboardsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.values = action.payload;
      });
  }
});

export const selectDashboard = (state: RootState) => {
  const { status, values } = state.dashboard;
  return {
    status,
    values
  };
};

export const dashboardReducer = dashboardManagerSlice.reducer;
