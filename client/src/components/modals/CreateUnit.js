import React, {useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {doCreate} from "../../http/storeAPI";
import InlineAlert from "../UI/InlineAlert/InlineAlert";
import {API_ROUTES} from "../../utils/consts";

const CreateUnit = ({show, onHide}) => {
	const [name, setName] = useState()
	const [alertVisible, setAlertVisible] = useState(false)
	const [alertMessage, setAlertMessage] = useState(false)

	const addType = () => {
		doCreate(API_ROUTES.unit,{name: name}).then(() => {
			setName('')
			onHide()
		}).catch(e => {
			setAlertMessage(e.response.data)
			setAlertVisible(true)
		});
	};

	return (
		<Modal
			show={show}
			onHide={onHide}
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Добавить новую едицу измерения
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Control
						onChange={e => setName(e.target.value)}
						placeholder={"Введите название"}
					/>
				</Form>
				<InlineAlert
					show={alertVisible}
					setShow={setAlertVisible}
					message={alertMessage}
				/>
			</Modal.Body>
			<Modal.Footer>

				<Button onClick={onHide} variant="outline-danger">Закрыть</Button>
				<Button onClick={addType} variant="outline-success">Добавить</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default CreateUnit;