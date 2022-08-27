import React from 'react';
import {Form} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import MultiSelect from "../MultiSelect/MultiSelect";

const InputControl = observer(({set, value, inputName, hidden, add, isClearable, autoFocus, onChange, selectOptions}) => {
	return (
		<Form>
			{set.type === 'string' &&
				<Form.Control
					onChange={e => onChange(e)}
					value={value}
					placeholder={set.placeholder}
					autoFocus={autoFocus}
					name={inputName}
				/>
			}
			{set.type === 'select' && (hidden || add) &&
				<MultiSelect
					isMulti={false}
					isClearable={isClearable}
					className="basic-multi-select"
					options={selectOptions}
					value={value}
					name={inputName}
					autoFocus={autoFocus}
					menuIsOpen={true}
					placeholder={set.placeholder}
					onChange={e => onChange(e ? {'name': set.name, 'value': e.id}: {'name': set.name, value: ''})}
				/>
			}

		</Form>
	);
});

export default InputControl;