import React, {useContext, useEffect, useState} from 'react';
import InputControl from "../UI/Admin/InputControl";
import {ADMIN} from "../../utils/consts";
import {Context} from "../../index";
import {Col, Row} from "react-bootstrap";

const Filter = ({conf, filterCallback, aggregate}) => {
	const [fieldValues, setFieldValues] = useState({})

	const contextScope = useContext(Context)
	useEffect(() => {
		filterCallback(fieldValues)
	}, [fieldValues, filterCallback])

	const handleChange = e => {
		let value = ''
		let name = e.name || e.target.name;
		if ('value' in e) value = e.value
		if ('target' in e && 'value' in e.target) value = e.target.value
		if (typeof value === "object" && value.length === 2) {
			setFieldValues(prevState => ({
				...prevState,
				['min_'+name]: value[0],
				['max_'+name]: value[1],
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
			<div
				className="d-flex justify-content-start align-items-center"
			>
				{conf.fields.map(set =>
					<div
						key={set.name}
						className="me-2"
					>
						<InputControl
							add
							filterComponent
							set={set}
							min={aggregate ? aggregate['min_'+set.name] : 0}
							max={aggregate ? aggregate['max_'+set.name] : 0}
							isClearable={true}
							inputName={set.name}
							onChange={e => handleChange(e)}
							value={fieldValues[set.name] ? fieldValues[set.name] : ''}
							selectOptions={set.contextName && contextScope[set.contextName].data}
						/>
					</div>
				)}
			</div>

			{conf.dependencies.map(set =>
				<Row key={set.name}
					 className="align-items-center">
					<Col md={2}>
						<h6>{set.inlineTitle}</h6>
					</Col>
					<Col md={10} className="d-flex flex-row justify-content-start align-items-center">
						{ADMIN[set.name].fields.map(dep =>
							<div
								key={dep.name}
								className="ps-1"
							>
								<InputControl
									set={dep}
									filterComponent
									isClearable={true}
									onChange={e => handleChange(e)}
									add={dep.name !== conf.selfName}
									inputName={dep.backendFiltersetField ? dep.backendFiltersetField : dep.name}
									value={fieldValues[dep.backendFiltersetField] ? fieldValues[dep.backendFiltersetField] : fieldValues[dep.name]}
									selectOptions={dep.contextName && contextScope[dep.contextName].data}
								/>
							</div>
						)}

					</Col>
				</Row>
			)}
			{/*<div>*/}
			{/*	<Button variant={"outline-dark"} onClick={e => setFieldValues({})}>Сбросить</Button>*/}
			{/*</div>*/}

		</div>
	);
};

export default Filter;