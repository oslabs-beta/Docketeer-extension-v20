import React, { useState as useStateMock } from 'react';
import store from "../ui/src/store";
import { Provider } from "react-redux";
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, beforeEach, expect, test, jest } from "@jest/globals";
import '@testing-library/jest-dom/extend-expect';
import Images from '../ui/src/components/Images/Images';
import imageReducer from '../ui/src/reducers/imageReducer';


jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

describe('Images component', () => {
  beforeEach(() => {
    const mockUseState = jest.fn();
    mockUseState.mockReturnValue([false, jest.fn()]);
    React.useState = mockUseState;
  });

  test('renders Images component', () => {
    const store = configureStore({
      reducer: {
        images: imageReducer,
      },
    });

    render(
      <Provider store={store}>
        <Images />
      </Provider>
    );

    const linkElement = screen.getByText(/VULNERABILITY/i);
    expect(linkElement).toBeInTheDocument();
  });
});



// 	xtest('renders Images component', () => {
// 		// Mock initial state for useState
// 		const mockImagesList = [];
// 		const mockTime = '2024-03-22T12:00:00';
// 		const mockIsSavedState = false;
// 		const mockTotalVul = 0;

// 		// Mock useState with initial state values
// 		React.useState
// 			.mockReturnValueOnce([mockImagesList, jest.fn()])
// 			.mockReturnValueOnce([mockTime, jest.fn()])
// 			.mockReturnValueOnce([mockIsSavedState, jest.fn()])
// 			.mockReturnValueOnce([mockTotalVul, jest.fn()]);

// 		const { getByText } = render(<Images />);

// 		expect(getByText('VULNERABILITY')).toBeInTheDocument();
// 		expect(getByText(`Image - Last Scan: ${mockTime}`)).toBeInTheDocument();
// 	});

// 	xtest('clicking RESCAN button dispatches action and shows toast on success', async () => {
// 		// Mock useDispatch hook
// 		const mockDispatch = jest.fn();
// 		React.useDispatch = jest.fn(() => mockDispatch);

// 		// Render the component
// 		const { getByText } = render(<Images />);
// 		const rescanButton = getByText('RESCAN');

// 		// Simulate button click
// 		fireEvent.click(rescanButton);

// 		// Assert that dispatch functions are called
// 		await waitFor(() => {
// 			expect(mockDispatch).toHaveBeenCalledTimes(2); // One for resetImageProperties and one for fetchImages
// 			expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
// 			expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
// 		});

// 		// Assert that toast message is displayed
// 		expect(getByText('Rescanning...!')).toBeInTheDocument();
// 	});


// 	/* -----  image cards render  ------ */
// 	xdescribe('Images Card Testing', () => {
// 		test('Run images button clicks', () => {
// 			const runButton = screen.getByRole('button', { name: 'RUN' });
// 			expect(runButton).toBeInTheDocument();
// 			fireEvent.click(runButton);
// 			expect(props.runIm).toBeCalledTimes(1);
// 		});
// 		test('Remove image button clicks', () => {
// 			const removeButton = screen.getByRole('button', { name: 'REMOVE' });
// 			expect(removeButton).toBeInTheDocument();
// 			fireEvent.click(removeButton);
// 			expect(props.removeIm).toBeCalledTimes(1);
// 		});
// 		test('Renders an image if one is found', () => {
// 			const redisImage = screen.getByText('Redis');
// 			const imageId = screen.getByText('Image ID: 2718634043dc');
// 			const imageSize = screen.getByText('Image Size: 111 MB');
// 			const imageTag = screen.getByText('16.4');

// 			expect(redisImage).toBeInTheDocument();
// 			expect(imageId).toBeInTheDocument();
// 			expect(imageSize).toBeInTheDocument();
// 			expect(imageTag).toBeInTheDocument();
// 		});
// 	});
// });
