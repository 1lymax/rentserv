import {observer} from "mobx-react-lite";
import Select from "react-select";
import classes from './MultiSelect.module.css'
// import {Autocomplete, TextField} from "@mui/material";

const MultiSelect = observer(({
								  isMulti, isClearable, onChange, options,
								  value, placeholder, name,
								  getOptionValue, getOptionLabel, onKeyDown
							  }) => {

	return (
		<>
			<Select
				name={name}
				options={options}
				isMulti={isMulti}
				onKeyDown={e => onKeyDown(e)}
				isClearable={isClearable}
				placeholder={placeholder}
				defaultValue={options[options.findIndex(item => item.id === value)]}
				getOptionValue={getOptionValue ? getOptionValue : (option) => `${option.id}`}
				getOptionLabel={getOptionLabel ? getOptionLabel : (option) => `${option.name}`}
				className={classes.slct}
				classNamePrefix="myselect"
				onChange={e => onChange(e)}
			/>
			{/*<Autocomplete*/}

			{/*	disablePortal*/}
			{/*	options={options}*/}
			{/*	size="small"*/}
			{/*	defaultValue={options[options.findIndex(item => item.id === value)]}*/}
			{/*	getOptionLabel={getOptionLabel ? getOptionLabel : (option) => `${option.name}`}*/}
			{/*	//sx={{ width: 300 }}*/}
			{/*	//value={options.id}*/}
			{/*	renderInput={(params) =>*/}
			{/*		<TextField {...params} name={name} label={placeholder} />}*/}
			{/*/>*/}
		</>
	);
});

export default MultiSelect;