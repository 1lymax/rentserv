import React from 'react';
import {observer} from "mobx-react-lite";
import {Input, Menu} from "semantic-ui-react";
import {useNavigate} from "react-router-dom";

import Cart from "./Cart/Cart";
import UserMenu from "./UserMenu/UserMenu";
import {SHOP_ROUTE} from "../utils/consts";

const NavBar = observer(() => {
	const navigate = useNavigate()

	return (
		<Menu>
			<Menu.Item
				name='Home'
				onClick={() => navigate(SHOP_ROUTE)}
			/>
			<Menu.Menu position='right'>
				<Menu.Item>
					<Input icon='search' placeholder='Search...'/>
				</Menu.Item>
				<Menu.Item><Cart/></Menu.Item>
				<Menu.Item><UserMenu/></Menu.Item>
			</Menu.Menu>
		</Menu>

	);

});

export default NavBar;