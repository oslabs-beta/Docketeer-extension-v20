import { PayloadAction, createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { ImagesStateType, VulnerabilityPayload } from '../../ui-types';
import { ImageType } from '../../../types';
import Client from '../models/Client';
const initialState: ImagesStateType = {
  imagesList: []
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
      // console.log('action argument: ', action);

      // Updating the image object's Vulnerability property to have the scanned vulnerabilites
      // console.log(
      //   'in updateVulnerabilities reducer TOP',
      //   current(state.imagesList)
      // );
      const matchedImg = state.imagesList.find(
        (imageObj) => imageObj.ScanName === action.payload.scanName
      );
      matchedImg.Vulnerabilities = action.payload.vulnerabilityObj;
      // console.log(
      //   'in updateVulnerabilities reducer BOTTOM',
      //   current(matchedImg)
      // );
    },
    deleteImage(state, action: PayloadAction<string>) {
      console.log('Before deleting image from the list: ', current(state.imagesList));
      
      // find the index of the image object with the action.payload
      const imageIndex = state.imagesList.findIndex((imageObj) => imageObj.ID === action.payload)
      // splice the store.imageList at the found index, delete 1, insert nothing
      state.imagesList.splice(imageIndex, 1)
      console.log('After deleting image from the list: ', current(state.imagesList));

    }
  },
  extraReducers(builder) {
    builder.addCase(fetchImages.fulfilled, (state, action) => {
      state.imagesList = action.payload;
    });
  },
});

export const {updateVulnerabilities, deleteImage} = imageSlice.actions
export default imageSlice.reducer;
