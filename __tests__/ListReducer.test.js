import containerReducer, {
  fetchRunningContainers,
  fetchStoppedContainers,
  containerSlice, removeContainer, displayErrorModal
} from '../ui/src/reducers/containerReducer';
import imageReducer, { imageSlice, deleteImage, fetchImages} from '../ui/src/reducers/imageReducer';
import { describe, beforeEach, expect, test } from '@jest/globals';
import { configureStore, createAsyncThunk } from '@reduxjs/toolkit';
import { ddClientRequest } from '../ui/src/models/ddClientRequest';

// Creates a mock ddClient Request for Testing
jest.mock('../ui/src/models/ddClientRequest', () => ({
  ddClientRequest: jest.fn(),
}));

describe('Container reducer', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      imagesList: [],
      runningList: [],
      stoppedList: [],
      errorModalOn: false,
    };
  })

  describe('Action Types', () => {
    test('Should return initial state if type is invalid', () => {
      expect(containerReducer(initialState, { type: 'FakeActionType' })).toBe(initialState);
    });
  });

  // Testing Asynchronous Redux Thunk calls
  describe('Container Thunks', () => {
    let store;

    beforeEach(() => {
      store = configureStore({
        reducer: {
          containers: containerSlice.reducer,
        },
      });

      // Reset mocks before each test
      ddClientRequest.mockReset();
    });

    test('fetchRunningContainers should fetch and update running containers', async () => {
      const mockContainers = [
        { ID: '123', name: 'container1' },
        { ID: '456', name: 'container2' },
      ];
      ddClientRequest.mockResolvedValue(mockContainers);

      await store.dispatch(fetchRunningContainers());

      const state = store.getState();
      expect(state.containers.runningList).toEqual(mockContainers);
    });

    test('fetchStoppedContainers should fetch and update stopped containers', async () => {
      const mockContainer = [{ ID: '789', name: 'container3' }];
      ddClientRequest.mockResolvedValue(mockContainer);

      await store.dispatch(fetchStoppedContainers());

      const state = store.getState();
      expect(state.containers.stoppedList).toEqual(mockContainer);
    });
  });
  // Synchronous Testing
  describe('containerSlice reducers', () => {
  
    test('removeContainer should remove a container from stoppedList', () => {
      const startState = {
        ...initialState,
        stoppedList: [
          { ID: '123', name: 'container1' },
          { ID: '456', name: 'container2' },
        ],
      };
      const action = removeContainer('123');
      const newState = containerReducer(startState, action);
      expect(newState.stoppedList).toEqual([{ ID: '456', name: 'container2' }]);
    });

    test('displayErrorModal should toggle the error modal', () => {
      const action = displayErrorModal(true);
      const newState = containerReducer(initialState, action);
      expect(newState.errorModalOn).toBe(true);
    });
  });
});

// Image Reducer Tests
describe('Image Reducers', () => {
  let initialState;

  let store;
  beforeEach(() => {
    initialState = {
      imagesList: [],
      timeStamp: '',
      isSaved: false,
      totalVul: 0,
    };
    store = configureStore({
      reducer: {
        images: imageSlice.reducer,
      },
    });
  });

  describe('fetch images', () => {
    test('should return in empty array if no images have been added', async () => {
      expect(store.getState().images.imagesList).toEqual([])
    }),
    test('should overwrite the imagesList array in state to update it', async () => {
    
      const mockImages = [
        { ID: '1'},
        { ID: '2'},
      ];
      await store.dispatch(fetchImages.fulfilled(mockImages));
      expect(store.getState().images.imagesList).toEqual(mockImages);
    });
  });  
  describe('delete image', () => {
    test('should remove a specified image from the imagesList', async () => {
      const newState = {
            ...initialState, 
            imagesList: [{ ID: '1' }, { ID: '2' }],
      };
      store = configureStore({ reducer: { images: imageSlice.reducer }, preloadedState: { images: newState } });
      store.dispatch(deleteImage('1'))
      expect(store.getState().images.imagesList).toEqual([{ ID: '2' }]);
    });
  });
});  
  
