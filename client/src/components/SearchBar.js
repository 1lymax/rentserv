import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import MultiSelect from "./UI/MultiSelect/MultiSelect";

const SearchBar = observer(({onChange}) => {
	const {types} = useContext(Context)
	return (
		<MultiSelect isMulti={false}
					 className="basic-multi-select"
					 options={types.data}
					 placeholder={'Тип...'}
					 onChange={e => onChange(e)}
		/>
	);
})

export default SearchBar;