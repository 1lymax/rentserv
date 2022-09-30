import React, {useContext, useState} from 'react';
import {observer} from "mobx-react-lite";

import {Context} from "../index";
import {ADMIN} from "../utils/consts";
import InputControl from "./UI/InputControl/InputControl";
import {Accordion, Divider, Icon} from "semantic-ui-react";

const SearchBar = observer(({setFilter}) => {
	const contextScope = useContext(Context)
	const {vehicle} = useContext(Context)
	const [openParam, setOpenParam] = useState([])
	const [fieldValues, setFieldValues] = useState({})

	const filterSet = ADMIN.vehicle.fields



	const handleInputChange = (e) => {
		let value = ''
		let name = e.name || e.target.name;
		if ('value' in e) value = e.value
		if ('target' in e && 'value' in e.target) value = e.target.value
		if (typeof value === "object" && value.length === 2) {
			setFilter(prevState => ({
				...prevState,
				['min_' + name]: value[0],
				['max_' + name]: value[1],
			}));
			return
		}
		setFieldValues(prevState => ({
			...prevState,
			[name]: value,
		}));
		setFilter(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	const handleOpen = (name, value) => {
		setOpenParam(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	return (
		<>
			{filterSet.map(item =>
				<React.Fragment key={item.name}>
				<Accordion fluid>
					<Accordion.Title
						active={openParam[item.name]}
						onClick={() => handleOpen(item.name, !openParam[item.name])}
					>
						<Icon name={openParam[item.name] ? 'chevron down' : 'chevron right'}/>
						{item.placeholder}
					</Accordion.Title>
					<Accordion.Content active={openParam[item.name]}>
						<InputControl
							fluid
							noPlaceholder={true}
							set={item}
							key={item.name}
							filterComponent
							min={vehicle.aggregate ? vehicle.aggregate['min_' + item.name] : 0}
							max={vehicle.aggregate ? vehicle.aggregate['max_' + item.name] : 0}
							inputName={item.name}
							value={fieldValues[item.name] ? fieldValues[item.name] : ''}
							onChange={(e) => handleInputChange(e)}
							selectOptions={item.contextName && contextScope[item.contextName].data}/>
					</Accordion.Content>
				</Accordion>
				<Divider/>
				</React.Fragment>
			)}

		</>

		// <MultiSelect isMulti={false}
		// 			 isClearable={true}
		// 			 options={type.data}
		// 			 placeholder={'Тип...'}
		// 			 onChange={e => e ? onChange(e) : onChange('')}
		//
		// />
	);
})

export default SearchBar;