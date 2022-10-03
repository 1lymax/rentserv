import {useSnackbar} from "notistack";
import {observer} from "mobx-react-lite";
import {Accordion, Divider, Icon} from "semantic-ui-react";
import React, {useContext, useEffect, useState} from 'react';

import {Context} from "../index";
import {ADMIN} from "../utils/consts";
import {doFetch} from "../http/storeAPI";
import InputControl from "./UI/InputControl/InputControl";
import {convertErrorMessage} from "../utils/convertErrorMessage";

const SearchBar = observer(({setFilter}) => {
	const contextScope = useContext(Context)
	const {vehicle, type, store, city} = useContext(Context)
	const [openParam, setOpenParam] = useState([])
	const [fieldValues, setFieldValues] = useState({})
	const {enqueueSnackbar} = useSnackbar()

	const filterSet = ADMIN.vehicle.fields.concat(ADMIN.vehicle.filterAdditionalfields)

	useEffect(() => {
		doFetch(type)
			.then(data => type.setData(data.results))
			.catch(e => enqueueSnackbar(convertErrorMessage(e), {variant: "error"}));

		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		doFetch(store)
			.then(data => store.setData(data.results))
			.catch(e => enqueueSnackbar(convertErrorMessage(e), {variant: "error"}));

		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		doFetch(city)
			.then(data => city.setData(data.results))
			.catch(e => enqueueSnackbar(convertErrorMessage(e), {variant: "error"}));
		// eslint-disable-next-line
	}, []);

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
							<div style={{display:"flex", justifyContent:"space-between"}}>
								{item.placeholder}
								<Icon name={openParam[item.name] ? 'chevron down' : 'chevron right'}/>
							</div>

						</Accordion.Title>
						<Accordion.Content active={openParam[item.name]} >
							<InputControl
								fluid
								noPlaceholder
								set={item}
								key={item.name}
								filterComponent
								min={vehicle.aggregate ? vehicle.aggregate['min_' + item.name] : 0}
								max={vehicle.aggregate ? vehicle.aggregate['max_' + item.name] : 0}
								inputName={item.backendFiltersetField ? item.backendFiltersetField : item.name}
								value={
									fieldValues[item.backendFiltersetField ? item.backendFiltersetField : item.name]
										? fieldValues[item.backendFiltersetField ? item.backendFiltersetField : item.name]
										: ''
								}
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