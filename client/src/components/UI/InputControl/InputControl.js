import React, {useState} from 'react';
import {observer} from "mobx-react-lite";
import {Box, Slider, Typography} from "@mui/material";
import {Checkbox, Dropdown, Input} from "semantic-ui-react";

const InputControl = observer((props) => {
	const inputType = props.set.filter ? props.set.filter : props.set.type
	let sliderMin = props.min ? props.min : 0
	let sliderMax = props.max ? props.max : 100000
	const [sliderValue, setSliderValue] = useState([sliderMin, sliderMax]);
	const [checkbox, setCheckbox] = useState(props.value)

	const handleSliderChange = (e) => {
		setSliderValue(e.target.value)
		props.onChange(e)
	}

	const handleCheckbox = () => {
		setCheckbox(!checkbox)
		props.onChange({name: props.inputName, value: !checkbox})
	};

	const handleDropdownSearch = (e, data) => {
		props.onChange({
			name: data.name,
			value: data.searchQuery
		})
	};

	const handleDropdownChange = (e, data) => {
		props.onChange({
			name: data.name,
			value: data && data.value ? data.value : ''
		})
	};

	return (
		<React.Fragment>
			{inputType === 'autocomplete' &&
				//console.log(props.selectOptions) &&
				<Dropdown
					fluid={props.fluid}
					search
					selection
					clearable
					value={props.value}
					selectOnBlur={false}
					name={props.inputName}
					searchQuery={props.value}
					placeholder={props.set.placeholder}
					options={props.selectOptions.map(item =>
						({
							key: item.id,
							text: item[props.inputName],
							value: item[props.inputName]
						})
					)}
					onChange={(e, data) => e && handleDropdownChange(e, data)}
					onSearchChange={(e, data) => e && handleDropdownSearch(e, data)}
				/>
			}
			{props.filterComponent && inputType === 'slider' &&
				<Box sx={{width: 200, marginX: '20px'}}>
					{!props.noPlaceholder &&
						<Typography gutterBottom>
							{props.set.placeholder}
						</Typography>
					}
					<Slider
						name={props.inputName}
						valueLabelDisplay="auto"
						disabled={props.disabled}
						onChange={handleSliderChange}
						min={sliderMin ? sliderMin : 1}
						max={sliderMax ? sliderMax : 1}
						value={sliderValue ? sliderValue : 1}
						marks={[
							{value: sliderMin, label: sliderMin},
							{value: sliderMax, label: sliderMax}
						]}
					/>
				</Box>
			}
			{(!props.filterComponent || (props.filterComponent && !props.set.filter)) && props.set.type === 'string' &&
				<Input
					fluid={props.fluid}
					name={props.inputName}
					disabled={props.disabled}
					autoFocus={props.autoFocus}
					onChange={e => props.onChange(e)}
					placeholder={props.set.placeholder}
					value={props.value ? props.value : ''}
					onKeyDown={e => e.key === 'Enter' && props.handleSubmit && props.handleSubmit(e)}
				/>
			}
			{props.set.type === 'select' &&
				<Dropdown
					search
					selection
					clearable
					openOnFocus
					fluid={props.fluid}
					value={props.value}
					selectOnBlur={false}
					name={props.inputName}
					header={props.noPlaceholder ? false : props.set.placeholder}
					placeholder={props.set.placeholder}
					options={props.selectOptions.map(item =>
						({
							key: item.id,
							text: item.name,
							value: item.id
						})
					)}
					searchInput={{ autoFocus: props.autoFocus }}
					onChange={(e, data) => e && handleDropdownChange(e, data)}
					onSearchChange={(e, data) => e && handleDropdownSearch(e, data)}
				/>
			}
			{props.set.type === 'checkbox' &&
				<Checkbox
					name={props.inputName}
					label={props.filterComponent ? props.set.placeholder: ""}
					onChange={() => handleCheckbox()}
					checked={!!props.value}
				/>
			}
		</React.Fragment>
	);
});

export default InputControl;