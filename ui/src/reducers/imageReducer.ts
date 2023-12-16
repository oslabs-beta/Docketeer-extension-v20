import { PayloadAction, createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { ImagesStateType, VulnerabilityPayload } from '../../ui-types';
import { ImageType } from '../../../types';
import Client from '../models/Client';
const initialState: ImagesStateType = {
  imagesList: [],
};

export const fetchImages = createAsyncThunk(
  'containers/fetchImages',
  async () => {
    const result: ImageType[] = await Client.ImageService.getImages();
    return result;
  }
);

export const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    updateVulnerabilities(state, action: PayloadAction<VulnerabilityPayload>) {
      console.log('action argument: ', action);
      
      // Updating the image object's Vulnerability property to have the scanned vulnerabilites
      console.log('in updateVulnerabilities reducer TOP', current(state.imagesList))
      const matchedImg = state.imagesList.find(imageObj => imageObj.ScanName === action.payload.scanName)
      matchedImg.Vulnerabilities = action.payload.success
      console.log('in updateVulnerabilities reducer BOTTOM', current(matchedImg))
    }
  },
  extraReducers(builder) {
    builder
      .addCase(
        fetchImages.fulfilled, (state, action) => {
          state.imagesList = action.payload;
        }
      )
  }
});

export const {updateVulnerabilities} = imageSlice.actions
export default imageSlice.reducer;
