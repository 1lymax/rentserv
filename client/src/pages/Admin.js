import {observer} from "mobx-react-lite";
import React, {useContext, useState} from 'react';
import {Container, Grid, Header, List} from "semantic-ui-react";

import {Context} from "../index";
import {authRoutes} from "../route";
import MainPage from "./Admin/MainPage";
import {ADMIN_ROUTE} from "../utils/consts";

const Admin = observer(() => {
	const contextScope = useContext(Context)
	const user = contextScope.user
	const [selectedLink, setSelectedLink] = useState('')
	const [SelectedComponent, setSelectedComponent] = useState(MainPage)

	return (
		<Container>
			{user.isStaff
				? <Grid columns={2}>
					<Grid.Row>
						<Grid.Column width={2}>
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
						<Grid.Column width={14}>
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