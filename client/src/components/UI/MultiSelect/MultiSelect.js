import {observer} from "mobx-react-lite";
import Select from "react-select";
import classes from './MultiSelect.module.css'

const MultiSelect = observer(({isMulti, onChange, options, placeholder}) => {

	return (
		<>
		<Select
			placeholder={placeholder}
			isMulti={isMulti}
			name="type"
			options={options}
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