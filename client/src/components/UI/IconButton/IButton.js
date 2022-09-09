import React from 'react';
import {IconButton} from "@mui/material";
//import {IconButton} from '@mui/joy';

const IButton = (props) => {
	return (
		<IconButton size='large' {...props} >
			{props.children}
		</IconButton>
	);
};

export default IButton;