import React from 'react';
import {IconButton} from "@mui/material";

const IButton = (props) => {
	return (
		<IconButton color="primary" size="large" {...props} >
			{props.children}
		</IconButton>
	);
};

export default IButton;