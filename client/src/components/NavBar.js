import React, {useContext} from 'react';
import {Context} from "../index";
import {Button, Container} from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {NavLink} from "react-router-dom";
import {SHOP_ROUTE} from "../utils/consts";
import {observer} from "mobx-react-lite";
import AuthModal from "./AuthModal";

const NavBar = observer(() => {
	const {user} = useContext(Context)
	const [modalShow, setModalShow] = React.useState(false);

	return (
		<Navbar bg="dark" variant="dark">
			<Container>
				<NavLink style={{color: "white"}} to={SHOP_ROUTE}>РентСерв - Сервис аренды строительной техники</NavLink>
				{user.isAuth ?
					<Nav className="ms-auto" style={{color: "white"}}>
						<Button variant={"outline-light"}>Админ панель</Button>
						<Button variant={"outline-light"} onClick={() => user.setIsAuth(false)} className="ms-2">Выйти</Button>
					</Nav>
					:
					<Nav className="ms-auto" style={{color: "white"}}>
						<Button variant={"outline-light"} onClick={() => user.setIsAuth(true)}>Авторизация</Button>
					</Nav>
				}
				<AuthModal
					show={modalShow}
					onHide={() => setModalShow(false)}
				/>
			</Container>


		</Navbar>

	)

});

export default NavBar;