import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

/* options is array of objects
  options = [
    {value: 'abc', label: 'Hi' },
    {value: 'def', label: 'Bye' }
  ]
 */

const animatedComponents = makeAnimated();

interface DropDownDataProps {
	selectedTime: { value: string; label: string }[];
	setSelectedTime: (object) => void;
	time: string[];
}

export default function DropDownData({
	selectedTime,
  setSelectedTime,
  time
}: DropDownDataProps): React.JSX.Element {

  const options: { value: string; label: string }[] = time.map((el,i,arr) => {
    return {
			value: el,
			label:
				i === arr.length - 1
					? `Latest - ${el}`
					: i === 0
					? `Oldest - ${el}`
					: el,
		};
  })

	const handleSelectChange = (selectedTime): void => {
		setSelectedTime(selectedTime);
	};

	return (
		<Select
			closeMenuOnSelect={false}
			components={animatedComponents}
			// defaultValue={[data[i], data[y]]}
			isMulti
			options={options} // data
			value={selectedTime}
			onChange={handleSelectChange}
			styles={{
				singleValue: (base) => ({ ...base, color: 'white' }),
				valueContainer: (base) => ({
					...base,
					color: 'white',
					width: '100%',
				}),
				control: (provided, state) => ({
					// search box
					...provided,
					backgroundColor: state.isFocused ? 'black' : '#3d1c0b',
					borderColor: '#2395d9',
					color: 'white',
				}),
				option: (provided, state) => ({
					// options in dropdown
					...provided,
					backgroundColor: 'white',
					color: 'black',
					'&:hover': {
						backgroundColor: '#7abee6',
					},
				}),
				multiValue: (provided) => ({
					// the 'x' button in selected box
					...provided,
					backgroundColor: 'red',
				}),
				multiValueLabel: (styles) => ({
					// selected box
					...styles,
					color: 'black',
					background: 'white',
				}),
				multiValueRemove: (styles) => ({
					...styles,
					color: '#12121',
					// 'x' icon selected box hover
					':hover': {
						backgroundColor: '#cf493a',
						color: 'black',
					},
				}),
				menu: (provided) => ({
					...provided,
					maxHeight: '500px',
					overflowY: 'auto',
				}),
			}}
			theme={(theme) => ({
				...theme,
				colors: {
					...theme.colors,
					neutral30: '#7abee6', // control border
					neutral50: 'white', // placeholder text "Select..."
					neutral80: 'white', // input color
					primary25: '#ccc', // option bg color focused
					primary: '#7abee6', // option bg color selected
					primary50: 'white', // option bg color active
				},
			})}
		/>
	);
}
