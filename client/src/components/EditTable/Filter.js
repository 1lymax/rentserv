import React, {useContext, useEffect, useState} from 'react';
import InputControl from "../UI/Admin/InputControl";
import {ADMIN} from "../../utils/consts";
import {Context} from "../../index";
import randomInt from "../../utils/randomInt";
import {Button} from "react-bootstrap";

const Filter = ({conf, filterCallback}) => {
	const [fieldValues, setFieldValues] = useState({})
	const [dependencyInput, setDependencyInput] = useState([
		conf.dependencies.map(set =>
			ADMIN[set.name].fields.map(dependency => ({
					name: dependency.name,
					value: '',
					number: randomInt(1, 500)
				})
			)
		)
	])
	const contextScope = useContext(Context)

	useEffect(() => {
		filterCallback(fieldValues)
	}, [fieldValues])

	const addDependencyInput = () => {
		setDependencyInput([...dependencyInput, {}])
	}

	const removeDependencyInput = (number) => {
		setDependencyInput(dependencyInput.filter(i => i.number !== number))
	}

	const changeDependencyInput = (e, number) => {
		const {name, value} = getNameValue(e)
		setDependencyInput(dependencyInput.map(i => i.number === number ? {...i, [name]: value} : i))
		console.log(name, value)
	}

	const handleChangeMainInput = e => {
		const {name, value} = getNameValue(e)
		setFieldValues(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	const getNameValue = (e) => {
		let value
		let name = e.name || e.target.name;
		if ('value' in e) value = e.value
		if ('target' in e && 'value' in e.target) value = e.target.value
		return {name, value}
	};

	return (
		<div>
			<div
				className="d-flex flex-row justify-content-between align-items-center"
			>
				{conf.fields.map(set =>
					<InputControl
						add
						set={set}
						isClearable={true}
						key={set.name}
						inputName={set.name}
						onChange={e => handleChangeMainInput(e)}
						value={fieldValues[set.name]}
						selectOptions={set.contextName && contextScope[set.contextName].data}
					/>
				)}
			</div>
			{conf.dependencies.map(set =>
				<div
					key={randomInt(1, 500)}
					className="d-flex flex-row justify-content-between align-items-center"
				>
					<Button variant={"outline-dark"}>+</Button>
					{ADMIN[set.name].fields.map(dependency =>
							<span key={randomInt(1, 500)}>
						{dependencyInput.map(dp =>
							<InputControl
								key={`${dependency.name} ${dp.number}`}
								isClearable={true}
								set={dependency}
								onChange={e => changeDependencyInput(e, dp.number)}
								value={dp.value}
								inputName={dependency.backendFiltersetField}
								add={dependency.name !== conf.selfName}
								selectOptions={dependency.contextName && contextScope[dependency.contextName].data}
							/>
						)}
					</span>
					)}


				</div>
			)}
		</div>
	);
};

export default Filter;