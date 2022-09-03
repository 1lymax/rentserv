import React from 'react';

const IconButton = (props) => {
	return (
		<IconButton {...props}>
			{props.children}
		</IconButton>
	);
};

export default IconButton;