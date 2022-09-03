import React from 'react';
//import {Button} from "react-bootstrap";
import {Button} from "@mui/material";


const OutlineButton = (props) => {
	return (
		// <Button
		// 	variant={"outline-dark"}
		// 	className="ms-1 p-1"
		// 	style={props.style}
		// 	onClick={(e) => props.onClick(e)}
		// >
		// 	{props.children}
		// </Button>
		<Button variant="outlined" color="primary" {...props}>
			{props.children}
		</Button>
	);
};

export default OutlineButton;