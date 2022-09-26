import React, {useState} from 'react';
import {observer} from "mobx-react-lite";
import Cart from "./Cart/Cart";
import UserMenu from "./UserMenu/UserMenu";
import {Input, Menu} from "semantic-ui-react";

const NavBar = observer(() => {
	const [activeLink, setActiveLink] = useState('home')

	const handleItemClick = (e, {name}) => setActiveLink(name)

	return (
		<Menu secondary>
			<Menu.Item
				name='home'
				active={activeLink === 'home'}
				onClick={handleItemClick}
			/>
			{/*<Menu.Item*/}
			{/*	name='messages'*/}
			{/*	active={activeItem === 'messages'}*/}
			{/*	onClick={this.handleItemClick}*/}
			{/*/>*/}
			{/*<Menu.Item*/}
			{/*	name='friends'*/}
			{/*	active={activeItem === 'friends'}*/}
			{/*	onClick={this.handleItemClick}*/}
			{/*/>*/}
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