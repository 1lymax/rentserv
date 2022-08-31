import {observer} from "mobx-react-lite";
import Select from "react-select";
import classes from './MultiSelect.module.css'

const MultiSelect = observer(({isMulti, isClearable, onChange, options, value,  placeholder, name}) => {

	return (
		<>
			<Select
				name={name}
				options={options}
				isMulti={isMulti}
				isClearable={isClearable}
				placeholder={placeholder}
				defaultValue={options[options.findIndex(item => item.id === value)]}
				getOptionValue={(option) => `${option.id}`}
				getOptionLabel={(option) => `${option.name}`}
				className={classes.slct}
				classNamePrefix="myselect"
				onChange={e => onChange(e)}
			/>
		</>
	);
});

export default MultiSelect;