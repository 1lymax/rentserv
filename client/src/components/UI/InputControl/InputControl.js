import React, {useState} from 'react';
import {observer} from "mobx-react-lite";
import {Box, Slider, Typography} from "@mui/material";
import classes from "./InputControl.module.css"
import {Dropdown, Input} from "semantic-ui-react";

const InputControl = observer((props) => {
	const inputType = props.set.filter ? props.set.filter : props.set.type
	let sliderMin = props.min ? props.min : 0
	let sliderMax = props.max ? props.max : 100000
	const [sliderValue, setSliderValue] = useState([sliderMin, sliderMax]);

	const handleSliderChange = (e) => {
		setSliderValue(e.target.value)
		props.onChange(e)
	}

	const handleDropdownSearch = (e, data) => {
		props.onChange({
			name: data.name,
			value: data.searchQuery
		})
	};

	const handleDropdownChange = (e, data) => {
		console.log(e, data)
		props.onChange({
			name: data.name,
			value: data && data.value ? data.value : ''
		})
	};


	return (
		<React.Fragment>
			{props.filterComponent && inputType === 'autocomplete' &&
				// <Autocomplete
				// 	freeSolo
				// 	size='small'
				// 	name={props.inputName}
				// 	disabled={props.disabled}
				// 	options={props.selectOptions}
				// 	onChange={e => e && props.onChange(e)}
				// 	onKeyDown={e => e.key === 'Enter' && props.handleSubmit(e)}
				// 	onInputChange={(e, value) => props.onChange({name: props.inputName, value: value})}
				// 	getOptionLabel={props.getOptionLabel ? props.getOptionLabel : (option) => option.name}
				// 	renderInput={(params) => <TextField {...params} name={props.inputName}
				// 										label={props.set.placeholder}/>}
				// />
				<Dropdown
					search
					selection
					clearable
					selectOnBlur={false}
					value={props.value}
					name={props.inputName}
					searchQuery={props.value}
					placeholder={props.set.placeholder}
					options={props.selectOptions.map(item =>
						({
							key: item.id,
							text: item.name,
							value: item.name
						})
					)}
					onSearchChange={(e, data) => e && handleDropdownSearch(e, data)}
					onChange={(e, data) => e && handleDropdownChange(e, data)}
				/>
			}
			{props.filterComponent && inputType === 'slider' &&
				<Box sx={{width: 200, marginX: '20px'}}>
					<Typography gutterBottom>
						{props.set.placeholder}
					</Typography>
					<Slider
						name={props.inputName}
						min={sliderMin ? sliderMin : 1}
						max={sliderMax ? sliderMax : 1}
						marks={[
							{value: sliderMin, label: sliderMin},
							{value: sliderMax, label: sliderMax}
						]}
						disabled={props.disabled}
						value={sliderValue ? sliderValue : 1}
						onChange={handleSliderChange}
						valueLabelDisplay="auto"
					/>
				</Box>
			}
			{(!props.filterComponent || (props.filterComponent && !props.set.filter)) && props.set.type === 'string' &&
				// <TextField
				// 	size='small'
				// 	name={props.inputName}
				// 	className={classes.root}
				// 	disabled={props.disabled}
				// 	autoFocus={props.autoFocus}
				// 	label={props.set.placeholder}
				// 	onChange={e => props.onChange(e)}
				// 	placeholder={props.set.placeholder}
				// 	value={props.value ? props.value : ''}
				// 	onKeyDown={e => e.key === 'Enter' && props.handleSubmit && props.handleSubmit(e)}
				// />
				<Input
					//size='small'
					name={props.inputName}
					className={classes.root}
					disabled={props.disabled}
					style={props.style}
					autoFocus={props.autoFocus}
					onChange={e => props.onChange(e)}
					placeholder={props.set.placeholder}
					value={props.value ? props.value : ''}
					onKeyDown={e => e.key === 'Enter' && props.handleSubmit && props.handleSubmit(e)}
				/>
			}
			{(!props.filterComponent || (props.filterComponent && !props.set.filter)) && props.set.type === 'select' && (props.hidden || props.add) &&
				<Dropdown
					search
					header={props.set.placeholder}
					selection
					clearable
					openOnFocus
					selectOnBlur={false}
					value={props.value}
					name={props.inputName}
					searchInput={{ autoFocus: props.autoFocus }}
					placeholder={props.set.placeholder}
					options={props.selectOptions.map(item =>
						({
							key: item.id,
							text: item.name,
							value: item.id
						})
					)}
					onSearchChange={(e, data) => e && handleDropdownSearch(e, data)}
					onChange={(e, data) => e && handleDropdownChange(e, data)}
				/>


				// <MultiSelect
				// 	isMulti={false}
				// 	menuIsOpen={true}
				// 	value={props.value}
				// 	name={props.inputName}
				// 	disabled={props.disabled}
				// 	autoFocus={props.autoFocus}
				// 	options={props.selectOptions}
				// 	isClearable={props.isClearable}
				// 	placeholder={props.set.placeholder}
				// 	onKeyDown={e => e.key === 'Enter' && props.handleSubmit && props.handleSubmit(e)}
				// 	onChange={e => props.onChange(e ? {name: props.inputName, 'value': e.id} : {
				// 		name: props.inputName,
				// 		value: ''
				// 	})}
				// />
			}

		</React.Fragment>
	);
});

export default InputControl;