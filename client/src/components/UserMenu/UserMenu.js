import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";

import {Context} from "../../index";
import {Dropdown, Icon} from "semantic-ui-react";
import {ADMIN_ROUTE, LOGIN_ROUTE} from "../../utils/consts";


const UserMenu = observer(() => {
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
		<React.Fragment>
			<Dropdown icon={{name: "bars", size: "large", color: "grey"}} direction="left" simple>
				<Dropdown.Menu>
					{user.isStaff &&
					<Dropdown.Item onClick={() => navigate(ADMIN_ROUTE)}>
						<Icon name={"shield alternate"}/> Admin Panel
					</Dropdown.Item>
				}
					{user.isAuth
						?
						<Dropdown.Item onClick={logout}>
							<Icon name={"sign out"}/> Logout
						</Dropdown.Item>
						:
						<Dropdown.Item onClick={() => navigate(LOGIN_ROUTE)}>
							<Icon name={"sign in"}/> Login
						</Dropdown.Item>
					}
				</Dropdown.Menu>
			</Dropdown>
		</React.Fragment>
	);
})

export default UserMenu;