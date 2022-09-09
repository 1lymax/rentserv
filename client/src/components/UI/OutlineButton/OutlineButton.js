import React from 'react';
import {Button} from "@mui/material";
//import {Button} from "react-bootstrap";
//import {Button} from "@mui/joy";


const OutlineButton = (props) => {
	return (
		<Button variant={"outlined"} {...props}>
			{props.children}
		</Button>
	);
};

export default OutlineButton;