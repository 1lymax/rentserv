import React from 'react';
import {IconButton} from "@mui/material";
// import Button from '@mui/';

const IButton = (props) => {
	return (
		<IconButton color='default' size='large' {...props} >
			{props.children}
		</IconButton>
	);
};

export default IButton;