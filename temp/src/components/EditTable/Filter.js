import React, {useContext, useEffect, useState} from 'react';
import InputControl from "../UI/Admin/InputControl";
import {ADMIN} from "../../utils/consts";
import {Context} from "../../index";

const Filter = ({conf, filterCallback}) => {
	const [fieldValues, setFieldValues] = useState({}	)

	const contextScope = useContext(Context)
	console.log(fieldValues)
	useEffect(() => {
		filterCallback(fieldValues)
	}, [fieldValues])

	const handleChange = e => {
		let value
		let name = e.name || e.target.name;
		if ('value' in e) value = e.value
		if ('target' in e && 'value' in e.target) value = e.target.value

		setFieldValues(prevState => ({
			...prevState,
			[name]: value
		}));
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
						onChange={e => handleChange(e)}
						value={fieldValues[set.name] ? fieldValues[set.name] : ''}
						selectOptions={set.contextName && contextScope[set.contextName].data}
					/>
				)}
			</div>
			{conf.dependencies.map(set =>
				<div
					key={set.name}
					className="d-flex flex-row justify-content-between align-items-center"
				>
					{ADMIN[set.name].fields.map(dependency =>
						<div key={dependency.name}>
							<InputControl
								set={dependency}
								isClearable={true}
								onChange={e => handleChange(e)}
								add={dependency.name !== conf.selfName}
								inputName={dependency.backendFiltersetField}
								value={fieldValues[dependency.backendFiltersetField] ? fieldValues[dependency.backendFiltersetField] : ''}
								selectOptions={dependency.contextName && contextScope[dependency.contextName].data}
							/>
						</div>
					)}

				</div>
			)}
		</div>
	);
};

export default Filter;