import React, {useContext, useState} from 'react';
import {Col, Container, ListGroup, Row} from "react-bootstrap";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {authRoutes} from "../route";
import {ADMIN_ROUTE} from "../utils/consts";
import MainPage from "./Admin/MainPage";

const Admin = observer(() => {
	const [SelectedComponent, setSelectedComponent] = useState(MainPage)
	const [selectedLink, setSelectedLink] = useState('')
	const {user} = useContext(Context)

	return (
		<Container>
			{user.isStaff
				? <Row className="mt-3">
					<Col md={3}>
						<ListGroup as="ul">
							{authRoutes.map(item =>
								item.path !== ADMIN_ROUTE &&
								<ListGroup.Item
									active={selectedLink === item.title}
									action
									as="li"
									key={item.title}

									onClick={() => {
										setSelectedLink(item.title)
										setSelectedComponent(item.Component)
									}}>
									{item.title}
								</ListGroup.Item>
							)
							}

						</ListGroup>

					</Col>
					<Col md={9}>
						<SelectedComponent/>
					</Col>
				</Row>
				:
				<div>
					Нет прав для просмотра
				</div>
			}
		</Container>
	);
});

export default Admin;