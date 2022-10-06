import React, {useContext, useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import MultiSelect from "../UI/MultiSelect/MultiSelect";
import {Context} from "../../index";

const CreateVehicle = ({show, onHide}) => {
	const {vehicles} = useContext(Context)
	const [selectedType, setSelectedType] = useState('')

	return (
		<Modal
			show={show}
			onHide={onHide}
			size="lg"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Добавить новую технику
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<MultiSelect isMulti={false}
								 className="basic-multi-select"
								 options={vehicles.types}
								 placeholder={'Тип...'}
								 onChange={e => setSelectedType(e.id)}
					/>
					<Form.Control
						placeholder={"Название"}
					/>
					<Form.Control
						placeholder={'Цена регион'}
					/>
					<Form.Control
						placeholder={'Цена столица'}
					/>

				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={onHide} variant="outline-danger">Закрыть</Button>
				<Button onClick={onHide} variant="outline-success">Добавить</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default CreateVehicle;