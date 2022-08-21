import React from 'react';
import {Alert} from "react-bootstrap";
import {observer} from "mobx-react-lite";

const InlineAlert = observer(({message, show, setShow}) => {
	let messageString = []
	for (let key in message) {
		messageString.push(<div key={key}><b>{key}</b>: {message[key]}</div>)
	}
	if (typeof message === Array) {
		message.map(item => messageString.push(<div key={item}>{item}</div>)
		)
	}

	return (
		<Alert
			show={show}
			className="mt-3"
			variant="danger"
			onClose={() => setShow(false)}
			dismissible
			transition={true}
		>
			<Alert.Heading>Ошибка!</Alert.Heading>
			<div>{messageString}</div>
		</Alert>
	);
});

export default InlineAlert;