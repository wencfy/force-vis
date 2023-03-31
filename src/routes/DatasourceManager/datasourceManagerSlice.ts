import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {DataViewState} from "../../components";
import {Datasource, db} from "../../utils";
import {RootState} from "../../app/store";

interface DatasourceManagerState extends DataViewState<Datasource> {
}

const initialState: DatasourceManagerState = {
  status: 'idle',
  values: []
}

export const getDatasourceAsync = createAsyncThunk(
  'datasource/getDatasource',
  async () => {
    const response = await db.data<Datasource, 'getAll'>('datasource', 'getAll');
    return response;
  }
)

const datasourceManagerSlice = createSlice({
  name: 'datasource',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDatasourceAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getDatasourceAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.values = action.payload;
      });
  }
});

export const selectDatasource = (state: RootState) => {
  const {status, values} = state.datasource;
  return {
    status, values
  }
}

export const datasourceReducer = datasourceManagerSlice.reducer;