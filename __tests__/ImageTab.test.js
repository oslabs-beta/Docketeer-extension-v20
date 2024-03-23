import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Images from '../ui/src/components/Images/Images';

jest.mock('react', () => ({
	...jest.requireActual('react'), // Use actual React implementation
	useState: jest.fn(),
}));

describe('Images component', () => {
	beforeEach(() => {
		// Reset the mock implementation before each test
		jest.clearAllMocks();
	});

	test('renders Images component', () => {
		// Mock initial state for useState
		const mockImagesList = [];
		const mockTime = '2024-03-22T12:00:00';
		const mockIsSavedState = false;
		const mockTotalVul = 0;

		// Mock useState with initial state values
		React.useState
			.mockReturnValueOnce([mockImagesList, jest.fn()])
			.mockReturnValueOnce([mockTime, jest.fn()])
			.mockReturnValueOnce([mockIsSavedState, jest.fn()])
			.mockReturnValueOnce([mockTotalVul, jest.fn()]);

		const { getByText } = render(<Images />);

		expect(getByText('VULNERABILITY')).toBeInTheDocument();
		expect(getByText(`Image - Last Scan: ${mockTime}`)).toBeInTheDocument();
	});

	xtest('clicking RESCAN button dispatches action and shows toast on success', async () => {
		// Mock useDispatch hook
		const mockDispatch = jest.fn();
		React.useDispatch = jest.fn(() => mockDispatch);

		// Render the component
		const { getByText } = render(<Images />);
		const rescanButton = getByText('RESCAN');

		// Simulate button click
		fireEvent.click(rescanButton);

		// Assert that dispatch functions are called
		await waitFor(() => {
			expect(mockDispatch).toHaveBeenCalledTimes(2); // One for resetImageProperties and one for fetchImages
			expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
			expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
		});

		// Assert that toast message is displayed
		expect(getByText('Rescanning...!')).toBeInTheDocument();
	});


	/* -----  image cards render  ------ */
	xdescribe('Images Card Testing', () => {
		test('Run images button clicks', () => {
			const runButton = screen.getByRole('button', { name: 'RUN' });
			expect(runButton).toBeInTheDocument();
			fireEvent.click(runButton);
			expect(props.runIm).toBeCalledTimes(1);
		});
		test('Remove image button clicks', () => {
			const removeButton = screen.getByRole('button', { name: 'REMOVE' });
			expect(removeButton).toBeInTheDocument();
			fireEvent.click(removeButton);
			expect(props.removeIm).toBeCalledTimes(1);
		});
		test('Renders an image if one is found', () => {
			const redisImage = screen.getByText('Redis');
			const imageId = screen.getByText('Image ID: 2718634043dc');
			const imageSize = screen.getByText('Image Size: 111 MB');
			const imageTag = screen.getByText('16.4');

			expect(redisImage).toBeInTheDocument();
			expect(imageId).toBeInTheDocument();
			expect(imageSize).toBeInTheDocument();
			expect(imageTag).toBeInTheDocument();
		});
	});
});
