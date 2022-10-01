import {observer} from "mobx-react-lite";
import {Header, Table} from "semantic-ui-react";
import React, {useContext, useEffect, useState} from 'react';

import {Context} from "../../../index";
import {ADMIN} from "../../../utils/consts";
import InputControl from "../../UI/InputControl/InputControl";

import classes from './Filter.module.css'

const Filter = observer(({conf, filterCallback}) => {
	const [fieldValues, setFieldValues] = useState({})

	const contextScope = useContext(Context)
	useEffect(() => {
		filterCallback(fieldValues)
	}, [fieldValues, filterCallback])

	useEffect(() => {
		conf.fields.map(set => (
				setFieldValues(prevState => ({
					...prevState,
					[set.name]: ''
				}))
			)
		)
		conf.dependencies.map(set => (
				ADMIN[set.name].fields.map(dep => (
					(
						setFieldValues(prevState => ({
							...prevState,
							[dep.backendFiltersetField ? dep.backendFiltersetField : dep.name]: ''
						}))
					)
				))
			)
		)
		// eslint-disable-next-line
	}, []);

	const getDependencyFieldValue = (dep) => {
		return fieldValues[dep.backendFiltersetField] ? fieldValues[dep.backendFiltersetField] : fieldValues[dep.name]
	};

	const handleChange = e => {
		let value = ''
		let name = e.name || e.target.name;
		if ('value' in e) value = e.value
		if ('target' in e && 'value' in e.target) value = e.target.value
		if (typeof value === "object" && value.length === 2) {
			setFieldValues(prevState => ({
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
	};
	// contextScope.vehicle.data && console.log(contextScope.vehicles.data.price_cap)
	return (
		<div>
			<div className={classes.filter_wrapper}>
				{conf.fields.map(set =>
					<div key={set.name}
						 className={classes.field_wrapper}
						 style={set.filterStyles ? set.filterStyles : {}}
					>
						<InputControl
							set={set}
							filterComponent
							inputName={set.name}
							onChange={e => handleChange(e)}
							min={set.aggregateContext ? contextScope[set.aggregateContext].aggregate['min_' + set.name] : 0}
							max={set.aggregateContext ? contextScope[set.aggregateContext].aggregate['max_' + set.name] : 0}
							value={fieldValues[set.name] ? fieldValues[set.name] : ''}
							selectOptions={set.contextName && contextScope[set.contextName].data}
						/>
					</div>
				)}
			</div>
			<Table basic={"very"} collapsing>
				<Table.Body>
					{conf.dependencies.map(set => !ADMIN[set.name].imageContent &&
						<Table.Row key={set.name} className={classes.filter_row}>
							<Table.Cell className={classes.cell}>
								<Header as="h4">{set.inlineTitle}</Header>
							</Table.Cell>
							<Table.Cell className={classes.cell}>
								<div className={classes.cell_wrapper}>
								{ADMIN[set.name].fields.map(dep =>
									set.field !== dep.name &&
									<div className={classes.field_wrapper} style={{width: dep.width * 45}} key={dep.name}>
										<InputControl fluid
													  set={dep}
													  key={dep.name}
													  filterComponent
													  onChange={e => handleChange(e)}
													  value={getDependencyFieldValue(dep)}
													  style={dep.filterStyles ? dep.filterStyles : {}}
													  min={dep.aggregateContext ? contextScope[dep.aggregateContext].aggregate['min_' + dep.name] : 0}
													  max={dep.aggregateContext ? contextScope[dep.aggregateContext].aggregate['max_' + dep.name] : 0}
													  selectOptions={dep.contextName && contextScope[dep.contextName].data}
													  inputName={dep.backendFiltersetField ? dep.backendFiltersetField : dep.name}
										/>
									</div>
								)}
								</div>

							</Table.Cell>
						</Table.Row>
					)}
				</Table.Body>
			</Table>
		</div>
	);
});

export default Filter;