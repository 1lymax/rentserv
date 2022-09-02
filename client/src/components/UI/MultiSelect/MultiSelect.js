import {observer} from "mobx-react-lite";
import Select from "react-select";
import classes from './MultiSelect.module.css'

const MultiSelect = observer(({
								  isMulti, isClearable, onChange, options,
								  value, placeholder, name, defaultValue,
								  getOptionValue, getOptionLabel
							  }) => {

	return (
		<>
			<Select
				name={name}
				options={options}
				isMulti={isMulti}
				isClearable={isClearable}
				placeholder={placeholder}
				defaultValue={defaultValue ? defaultValue : options[options.findIndex(item => item.id === value)]}
				getOptionValue={getOptionValue ? getOptionValue : (option) => `${option.id}`}
				getOptionLabel={getOptionLabel ? getOptionLabel : (option) => `${option.name}`}
				className={classes.slct}
				classNamePrefix="myselect"
				onChange={e => onChange(e)}
			/>
		</>
	);
});

export default MultiSelect;