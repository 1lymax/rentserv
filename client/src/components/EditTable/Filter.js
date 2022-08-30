import React, {useContext, useEffect, useState} from 'react';
import InputControl from "../UI/Admin/InputControl";
import {ADMIN} from "../../utils/consts";
import {Context} from "../../index";

const Filter = ({conf, filterCallback}) => {
	const [fieldValues, setFieldValues] = useState({}	)

	const contextScope = useContext(Context)
	useEffect(() => {
		filterCallback(fieldValues)
	}, [fieldValues, filterCallback])

	const handleChange = e => {
		let value = ''
		let name = e.name || e.target.name;
		if ('value' in e) value = e.value
		if ('target' in e && 'value' in e.target) value = e.target.value

		setFieldValues(prevState => ({
			...prevState,
			[name]: value,
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
					{ADMIN[set.name].fields.map(dep =>
						<div key={dep.name}>
							<InputControl
								set={dep}
								isClearable={true}
								onChange={e => handleChange(e)}
								add={dep.name !== conf.selfName}
								inputName={dep.backendFiltersetField}
								value={fieldValues[dep.backendFiltersetField] ? fieldValues[dep.backendFiltersetField] : ''}
								selectOptions={dep.contextName && contextScope[dep.contextName].data}
							/>
						</div>
					)}

				</div>
			)}
		</div>
	);
};

export default Filter;