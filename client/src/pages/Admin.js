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
	const contextScope = useContext(Context)
	const user = contextScope.user

	// useEffect(() => {
	// 	for (const obj of Object.values(contextScope)) {
	// 		obj.noFetchContextFromBackend === undefined && doFetch(obj)
	// 			.then(data => obj.setData(data))
	// 	}
	// }, [contextScope]);

	return (
		<Container fluid>
			{user.isStaff
				? <Row className="mt-3">
					<Col md={2}>
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
					<Col md={10}>
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