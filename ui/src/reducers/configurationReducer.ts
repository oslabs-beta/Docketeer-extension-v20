import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ConfigurationState } from '../../ui-types';

const initialState: ConfigurationState = {
  global: {},
  scrapeConfigs: [],
};

export const configurationSlice = createSlice({
  name: 'configuration',
  initialState,
  reducers: {
    setGlobal: (state, action: PayloadAction<any>) => {
      state.global = action.payload;
    },
    setScrapeConfigs: (state, action: PayloadAction<any[]>) => {
      state.scrapeConfigs = action.payload;
    },
    setTargets: (state, action: PayloadAction<any[]>) => {
      const idx = action.payload[0];
      const targets = action.payload[1];
      state.scrapeConfigs[idx].static_configs[0].targets = targets;
    }
  },
});

export const { setGlobal, setScrapeConfigs } = configurationSlice.actions;
export default configurationSlice.reducer;
