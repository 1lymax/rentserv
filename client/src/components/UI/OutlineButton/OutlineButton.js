import React from 'react';
import {Button} from "react-bootstrap";

const OutlineButton = (props) => {
	return (
		<Button
			variant={"outline-dark"}
			className="ms-1 p-1"
			style={props.style}
			onClick={(e) => props.onClick(e)}
		>
			{props.children}
		</Button>
	);
};

export default OutlineButton;