import React from 'react';
import {Form} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import MultiSelect from "../MultiSelect/MultiSelect";

const InputControl = observer(({sets, value, hidden, add, autoFocus, onChange, selectOptions}) => {
	return (
		<Form>
			{sets.type === 'string' &&
				<Form.Control
					onChange={e => onChange(e)}
					value={value}
					placeholder={sets.placeholder}
					autoFocus={autoFocus}
					name={sets.name}
				/>
			}
			{sets.type === 'select' && (hidden || add) &&
				<MultiSelect isMulti={false}
							 className="basic-multi-select"
							 options={selectOptions}
							 value={value}
							 name={sets.name}
							 autoFocus={autoFocus}
							 menuIsOpen={true}
							 placeholder={sets.placeholder}
							 onChange={e => onChange({'name': sets.name, 'value': e.id})}
				/>
			}

		</Form>
	);
});

export default InputControl;