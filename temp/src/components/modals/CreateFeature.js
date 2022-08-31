import React, {useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {doCreate} from "../../http/storeAPI";
import InlineAlert from "../UI/InlineAlert/InlineAlert";
import {API_ROUTES} from "../../utils/consts";

const CreateFeature = ({show, onHide}) => {
	const [name, setName] = useState()
	const [alertVisible, setAlertVisible] = useState(false)
	const [alertMessage, setAlertMessage] = useState(false)

	const addFeature = () => {
		doCreate(API_ROUTES.feature,{name: name}).then(() => {
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
			size="lg"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Добавить новую характеристику
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Control
						placeholder={"Введите название типа"}
						onChange={e => setName(e.target.value)}
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
				<Button onClick={addFeature} variant="outline-success">Добавить</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default CreateFeature;