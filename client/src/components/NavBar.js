import React, {useContext} from 'react';
import {Context} from "../index";
import {Button, Container} from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {NavLink, useNavigate} from "react-router-dom";
import {ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE} from "../utils/consts";
import {observer} from "mobx-react-lite";
import Cart from "./Cart/Cart";
import UserMenu from "./UserMenu/UserMenu";

const NavBar = observer(() => {
	const {user} = useContext(Context)
	const navigate = useNavigate()

	const logout = () => {
		user.setUser({})
		localStorage.setItem('access', '')
		localStorage.setItem('refresh', '')
		user.setIsAuth(false)
		user.setIsStaff(false)

	};

	return (
		<Navbar bg="dark" variant="dark">
			<Container>
				<NavLink style={{color: "white"}} to={SHOP_ROUTE}>
					РентСерв - Сервис аренды строительной техники
				</NavLink>
				{user.isAuth ?
					<Nav className="ms-auto" style={{color: "white"}}>
						{user.isStaff
							?
							<Button
								variant={"outline-light"}
								onClick={() => navigate(ADMIN_ROUTE)}
							>
								Админ панель
							</Button>
							:
							<></>
						}
						<Button
							variant={"outline-light"}
							onClick={logout} className="ms-2"
						>
							Выйти</Button>

						<Cart/>
						<UserMenu/>
					</Nav>
					:
					<Nav className="ms-auto" style={{color: "white"}}>
						<Button
							variant={"outline-light"}
							onClick={() => navigate(LOGIN_ROUTE)}
						>
							Авторизация
						</Button>
					</Nav>
				}
			</Container>


		</Navbar>

	);

});

export default NavBar;