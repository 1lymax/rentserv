import React from 'react';
import {Spinner} from "react-bootstrap";

const SpinnerButton = ({data}) => {
	return (
		<>
			<Spinner
				as="span"
				animation="border"
				size="sm"
				role="status"
				aria-hidden="true"
			/> {data}
		</>
	);
};

export default SpinnerButton;