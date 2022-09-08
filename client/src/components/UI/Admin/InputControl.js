import React, {useState} from 'react';
import {Form} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import MultiSelect from "../MultiSelect/MultiSelect";
import {Autocomplete, Box, Slider, TextField, Typography} from "@mui/material";

const InputControl = observer((props) => {
	const inputType = props.set.filter ? props.set.filter : props.set.type
	let sliderMin = props.min ? props.min: 0
	let sliderMax = props.max ? props.max: 100000
	const [sliderValue, setSliderValue] = useState([sliderMin, sliderMax]);

	const handleSliderChange = (e) => {
		setSliderValue(e.target.value)
		props.onChange(e)
	}

	return (
		<Form>
			{props.filterComponent && inputType === 'autocomplete' &&
				<Autocomplete
					freeSolo

					size='small'
					options={props.selectOptions}
					//value={props.value}
					name={props.inputName}
					onChange={e => e && props.onChange(e)}
					onInputChange={(e, value) => props.onChange({name: props.inputName, value: value})}
					getOptionLabel={props.getOptionLabel ? props.getOptionLabel : (option) => `${option.name}`}
					renderInput={(params) => <TextField {...params} name={props.inputName} label={props.set.placeholder}/>}
				/>
			}
			{props.filterComponent && inputType === 'slider' &&
				<Box sx={{width: 200, marginX: '20px'}}>
					<Typography gutterBottom>
						{props.set.placeholder}
					</Typography>
					<Slider
						name={props.inputName}
						min={sliderMin}
						max={sliderMax}
						marks={[
							{value: sliderMin, label: sliderMin},
							{value: sliderMax, label: sliderMax}
						]}
						value={sliderValue}
						onChange={handleSliderChange}
						valueLabelDisplay="auto"
					/>
				</Box>
			}
			{(!props.filterComponent || (props.filterComponent && !props.set.filter)) && props.set.type === 'string' &&
				<Form.Control
					value={props.value}
					name={props.inputName}
					onChange={e => props.onChange(e)}
					placeholder={props.set.placeholder}
					autoFocus={props.autoFocus}
				/>
			}
			{(!props.filterComponent || (props.filterComponent && !props.set.filter)) && props.set.type === 'select' && (props.hidden || props.add) &&
				<MultiSelect
					isMulti={false}
					isClearable={props.isClearable}
					className="basic-multi-select"
					options={props.selectOptions}
					value={props.value}
					name={props.inputName}
					autoFocus={props.autoFocus}
					menuIsOpen={true}
					placeholder={props.set.placeholder}
					onChange={e => props.onChange(e ? {name: props.inputName, 'value': e.id} : {
						name: props.inputName,
						value: ''
					})}
				/>
			}

		</Form>
	);
});

export default InputControl;