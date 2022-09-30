import React, {useContext, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {authRoutes} from "../route";
import {ADMIN_ROUTE} from "../utils/consts";
import MainPage from "./Admin/MainPage";
import {Container, Grid, Header, List} from "semantic-ui-react";

const Admin = observer(() => {
	const [SelectedComponent, setSelectedComponent] = useState(MainPage)
	const [selectedLink, setSelectedLink] = useState('')
	const contextScope = useContext(Context)
	const user = contextScope.user

	return (
		<Container>
			{user.isStaff
				? <Grid columns={2}>
					<Grid.Row className="mt-3">
						<Grid.Column width={3}>
							<Header as="h3">Categories</Header>
							<List selection animated size="large" verticalAlign="middle">
								{authRoutes.map(item =>
									item.path !== ADMIN_ROUTE &&
									<List.Item
										active={selectedLink === item.title}
										key={item.title}
										onClick={() => {
											setSelectedLink(item.title)
											setSelectedComponent(item.Component)
										}}>
										<List.Content>
											<List.Description>
												{item.title}
											</List.Description>
										</List.Content>
									</List.Item>
								)
								}

							</List>

						</Grid.Column>
						<Grid.Column width={13}>
							<SelectedComponent/>
						</Grid.Column>
					</Grid.Row>
				</Grid>
				:
				<div>
					Нет прав для просмотра
				</div>
			}
		</Container>
	);
});

export default Admin;