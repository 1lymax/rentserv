import {observer} from "mobx-react-lite";
import React, {useContext, useState} from 'react';
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {Button, Container, Form, Grid, Icon, Input, Segment} from "semantic-ui-react";

import {Context} from "../../index";
import {login, registration} from "../../http/userAPI";
import InlineAlert from "../../components/UI/InlineAlert/InlineAlert";
import {LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE} from "../../utils/consts";

import classes from "./Auth.module.css";

const Auth = observer(() => {
	const {user} = useContext(Context)
	const location = useLocation()
	const navigate = useNavigate()
	const isLogin = location.pathname === LOGIN_ROUTE

	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [first_name, setFirstName] = useState('')
	const [last_name, setLastName] = useState('')

	const [alertVisible, setAlertVisible] = useState(false)
	const [alertMessage, setAlertMessage] = useState(false)

	const submit = async () => {
		try {
			let data
			if (isLogin) {
				data = await login(username, password)
			} else {
				data = await registration(username, email, password, first_name, last_name)
			}
			user.setUser(data)
			user.setIsAuth(true)
			user.setIsStaff(data.isStaff)
			navigate(SHOP_ROUTE)
		} catch (e) {
			setAlertVisible(true)
			setAlertMessage(e.response.data)
		}

	}

	return (
		<Container className={classes.auth_container}>
			<Segment style={{width: 600}}>
				<h2 className="m-auto">{isLogin ? "Authorization" : "Registration"}</h2>
				<Form>
					<Form.Field placeholder="Login">
						<label>Login</label>
						<Input placeholder='Login'
							   value={username}
							   onChange={e => setUsername(e.target.value)}/>
					</Form.Field>
					<Form.Field
						value={password}
						onChange={e => setPassword(e.target.value)}
						placeholder="Password"
					>
						<label>Password</label>
						<input placeholder='Password'
							  type={"password"}
							  value={password}
							  onChange={e => setPassword(e.target.value)}/>
					</Form.Field>
					{!isLogin
						?
						<>
							<Form.Field placeholder="Email">
								<label>Email</label>
								<input placeholder='Email'
									   type={"email"}
									   value={email}
									   onChange={e => setEmail(e.target.value)}/>
							</Form.Field>
							<Form.Field placeholder="First name">
								<label>First name</label>
								<input placeholder='First name'
									   value={first_name}
									   onChange={e => setFirstName(e.target.value)}/>
							</Form.Field>
							<Form.Field placeholder="Last name">
								<label>Last name</label>
								<input placeholder='Last name'
									   value={last_name}
									   onChange={e => setLastName(e.target.value)}/>
							</Form.Field>
						</>
						:
						<></>

					}
					<InlineAlert
						show={alertVisible}
						setShow={setAlertVisible}
						message={alertMessage}
					/>
					<Grid columns={2}>
						<Grid.Column textAlign="left" verticalAlign="middle">
							{isLogin
								?
								<div>
									No account? <NavLink to={REGISTRATION_ROUTE}>Sign in!</NavLink>
								</div>
								:
								<div>
									Already registered? <NavLink to={LOGIN_ROUTE}>Login</NavLink>
								</div>
							}
						</Grid.Column>
						<Grid.Column textAlign="right">
							<Button icon labelPosition="right" primary
									onClick={submit}
							>
								<Icon name={"sign-in"}/>
								{isLogin ? "Login" : "Sign in"}
							</Button>
						</Grid.Column>
					</Grid>
				</Form>
			</Segment>

		</Container>
	);
});

export default Auth;