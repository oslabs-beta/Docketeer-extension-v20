import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PromDataSourceType, EndpointType } from '../../../types';
import { ConfigurationState } from '../../ui-types';

const initialState: ConfigurationState = {
  prometheusDataSources: [],
  jobnames: [],
  typeOfEndpoint: [],
  entryForm: {
    jobname: '',
    url: '',
  }
};

export const configurationSlice = createSlice({
  name: 'configuration',
  initialState,
  reducers: {
    setEntryForm: (state, action: PayloadAction<PromDataSourceType>) => {
      state.entryForm = {...state.entryForm, ...action.payload};
    },
    setEndpointTypes: (state, action: PayloadAction<EndpointType[]>) => {
      state.typeOfEndpoint = action.payload;
    },
    setPrometheusDataSources: (state, action: PayloadAction<PromDataSourceType[]>) => {
      state.prometheusDataSources = action.payload;
    },
    addJobName: (state, action: PayloadAction<string>) => {
      if (!state.jobnames.includes(action.payload)) state.jobnames.push(action.payload);
    }
    
  },
});

export const { setEntryForm, setEndpointTypes, setPrometheusDataSources, addJobName } = configurationSlice.actions;
export default configurationSlice.reducer;
