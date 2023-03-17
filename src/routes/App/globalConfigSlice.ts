import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";

export interface GlobalConfigState {
  theme: 'light' | 'dark';

}

const initialState: GlobalConfigState = {
  theme: 'light',
};

export const globalConfigSlice = createSlice({
  name: 'globalConfig',
  initialState,
  reducers: {
    changeTheme: state => {
      if (state.theme === 'dark') {
        state.theme = 'light';
      } else {
        state.theme = 'dark';
      }
    }
  }
});

export const { changeTheme } = globalConfigSlice.actions;

export const selectTheme = (state: RootState) => state.globalConfig.theme;

export default globalConfigSlice.reducer;