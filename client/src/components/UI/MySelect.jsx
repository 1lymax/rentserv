import React from 'react';

const MySelect = ({options, onChange}) => {
	return (
		<select
			onChange={e => onChange(e.target.value)}
		>
			{options.map(option =>
				<option key={option.value} value={option.value}>{option.name}</option>
			)}
		</select>
	);
};

export default MySelect;