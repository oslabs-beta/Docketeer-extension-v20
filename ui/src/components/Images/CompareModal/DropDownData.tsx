import React, { useState } from 'react';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

// const options = [
// 	{ value: 'chocolate', label: 'Chocolate' },
// 	{ value: 'strawberry', label: 'Strawberry' },
// 	{ value: 'vanilla', label: 'Vanilla' },
// ];

/* options is array of objects
  options = [
    {value: 'abc', label: 'Hi' },
    {value: 'def', label: 'Bye' }
  ]
 */

const animatedComponents = makeAnimated();

interface DropDownDataProps  {
  selectedTime: [];
  setSelectedTime: (any) => void;
  time: string[];
}

export default function DropDownData({
	selectedTime,
  setSelectedTime,
  time
}: DropDownDataProps): React.JSX.Element {

  const options = time.map(el => {
    return {value: el, label: el}
  })

	const handleSelectChange = (selectedTime): void => {
		setSelectedTime(selectedTime);
		console.log('SELECT-TIME ARRAY: ', selectedTime);
	};

	return (
		<Select
			closeMenuOnSelect={false}
			components={animatedComponents}
			// defaultValue={[data[i], data[y]]}
			isMulti
			options={options} // data
			value={selectedTime} // Pass selectedTime as the value
			onChange={handleSelectChange} // Handle onChange event
			onMenuClose={() => console.log('DELETED ALL!')}
			styles={{
				control: (provided, state) => ({
					...provided,
					backgroundColor: state.isFocused ? 'white' : '#406187', // Set background color of the control
					color: 'white', // Set text color
				}),
				option: (provided, state) => ({
					...provided,
					backgroundColor: 'white',
					color: 'black',
					'&:hover': {
						backgroundColor: '#7abee6',
					},
				}),
				multiValue: (provided) => ({
					...provided,
					backgroundColor: '#7abee6',
				}),
				menu: (provided) => ({
					...provided,
					maxHeight: '500px',
					overflowY: 'auto',
				}),
			}}
		/>
	);
}
