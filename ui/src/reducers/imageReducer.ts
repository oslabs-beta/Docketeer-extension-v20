import { PayloadAction, createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { ImagesStateType, VulnerabilityPayload, Top3Payload, EverythingPayload } from '../../ui-types';
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
      // find the index of the image object with the action.payload
      const imageIndex = state.imagesList.findIndex((imageObj) => imageObj.ID === action.payload)
      // splice the store.imageList at the found index, delete 1, insert nothing
      state.imagesList.splice(imageIndex, 1)
    },
    updateTop3(state, action: PayloadAction<Top3Payload>) {
      if (action.payload.scanName === '<none>:<none>') {
        state.imagesList.forEach((imageObj) => {
          if (imageObj.ScanName === action.payload.scanName) {
            imageObj.Top3Obj = action.payload.top3Obj;
          }
        })
      } else {
        const matchedImg = state.imagesList.find(
          (imageObj) => imageObj.ScanName === action.payload.scanName
        );
        matchedImg.Top3Obj = action.payload.top3Obj;
      }
    },
    addEverything(state, action: PayloadAction<EverythingPayload>) {
      if (action.payload.scanName === '<none>:<none>') {
        state.imagesList.forEach((imageObj) => {
          if (imageObj.ScanName === action.payload.scanName) {
            imageObj.Everything = action.payload.everything;
          }
        })
      } else {
        const matchedImg = state.imagesList.find(
          (imageObj) => imageObj.ScanName === action.payload.scanName
        );
        matchedImg.Everything = action.payload.everything;
      }
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchImages.fulfilled, (state, action) => {
      state.imagesList = action.payload;
    });
  },
});

export const {updateVulnerabilities, deleteImage, updateTop3, addEverything} = imageSlice.actions
export default imageSlice.reducer;
