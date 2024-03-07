import { PayloadAction, createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { ImagesStateType, VulnerabilityPayload } from '../../ui-types';
import { ImageType } from '../../../types';
import Client from '../models/Client';
const initialState: ImagesStateType = {
  imagesList: []
};
import { ddClientRequest } from '../models/ddClientRequest';

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

      // handle all cases where images are named and tagged <none>:<none> before moving on to handle active images
      if (action.payload.scanName === '<none>:<none>') {
        state.imagesList.forEach((imageObj) => {
          if (imageObj.ScanName === action.payload.scanName) {
            imageObj.Vulnerabilities = action.payload.vulnerabilityObj;
          }
        })
      } else {
        const matchedImg = state.imagesList.find(
          (imageObj) => imageObj.ScanName === action.payload.scanName
        );
        matchedImg.Vulnerabilities = action.payload.vulnerabilityObj;
      }
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
