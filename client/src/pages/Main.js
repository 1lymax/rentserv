import React from 'react';
import {Button, Container, Header, Icon, Segment} from "semantic-ui-react";
import {useNavigate} from "react-router-dom";
import {ADMIN_ROUTE, SHOP_ROUTE} from "../utils/consts";

const Main = () => {
	const navigate = useNavigate()

	return (
		<Container>
			<Segment placeholder>
				<Header icon>
					<Icon name='code'/>
					This site is working in demo mode.
				</Header>
				<Segment.Inline>
					<Button.Group>
						<Button primary onClick={() => navigate(SHOP_ROUTE)}>Go to shop</Button>
						<Button.Or/>
						<Button onClick={() => navigate(ADMIN_ROUTE)}>Admin panel</Button>
					</Button.Group>
				</Segment.Inline>
			</Segment>
		</Container>
	);
};

export default Main;