import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import MultiSelect from "./UI/MultiSelect/MultiSelect";

const SearchBar = observer(({onChange}) => {
	const {type} = useContext(Context)
	return (
		<MultiSelect isMulti={false}
					 isClearable={true}
					 className="basic-multi-select"
					 options={type.data}
					 placeholder={'Тип...'}
					 onChange={e => e ? onChange(e) : onChange('')}
		/>
	);
})

export default SearchBar;