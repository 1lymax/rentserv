import React, {useState} from 'react';
import {observer} from "mobx-react-lite";
import {Menu} from "semantic-ui-react";
import {useNavigate} from "react-router-dom";

import Cart from "./Cart/Cart";
import UserMenu from "./UserMenu/UserMenu";
import {ADMIN_ROUTE, MAIN_ROUTE, SHOP_ROUTE} from "../utils/consts";

const NavBar = observer(() => {
	const [active, setActive] = useState(0)
	const navigate = useNavigate()

	return (
		<Menu>
			<Menu.Item
				name='Home'
				active={active === 1}
				onClick={() => {
					navigate(MAIN_ROUTE)
					setActive(1)
				}}
			/>
			<Menu.Item
				name='Shop'
				active={active === 2}
				onClick={() => {
					navigate(SHOP_ROUTE)
					setActive(2)
				}}
			/>
			<Menu.Item
				name='Admin Panel'
				active={active === 3}
				onClick={() => {
					navigate(ADMIN_ROUTE)
					setActive(3)
				}}
			/>
			<Menu.Menu position='right'>
				{/*<Menu.Item>*/}
				{/*	<Input icon='search' placeholder='Search...'/>*/}
				{/*</Menu.Item>*/}
				<Menu.Item><Cart/></Menu.Item>
				<Menu.Item><UserMenu/></Menu.Item>
			</Menu.Menu>
		</Menu>

	);

});

export default NavBar;