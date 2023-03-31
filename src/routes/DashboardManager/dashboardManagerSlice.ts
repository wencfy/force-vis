import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {DataViewState} from "../../components";
import {db, Dashboard} from "../../utils";
import {RootState} from "../../app/store";

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

const dashboardManagerSlice = createSlice({
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
