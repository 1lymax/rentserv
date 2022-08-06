import React from 'react';
import {Button, Form, Modal, Row} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {REGISTRATION_ROUTE} from "../utils/consts";

const AuthModal = (props) => {
	return (
		<Modal
			{...props}

			size="ms"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Авторизация
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form className="d-flex flex-column">
					<Form.Control
						className="mt-3"
						placeholder="Введите ваш email..."
					/>
					<Form.Control
						className="mt-3"
						placeholder="Введите ваш пароль..."
					/>
					<Row className="d-flex justify-content-between m-0">
						<div className="align-self-auto">
							Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйся</NavLink>
						</div>
						<Button className="align-self-end mt-3" variant={"outline-success"}>
							Войти
						</Button>
					</Row>
				</Form>
			</Modal.Body>

		</Modal>
	);
};

export default AuthModal;