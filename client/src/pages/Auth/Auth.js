import {observer} from "mobx-react-lite";
import React, {useContext, useState} from 'react';
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {Button, Container, Form, Grid, Icon, Input, Segment} from "semantic-ui-react";

import {Context} from "../../index";
import {login, registration} from "../../http/userAPI";
import {LOGIN_ROUTE, MESSAGES, REGISTRATION_ROUTE, SHOP_ROUTE} from "../../utils/consts";

import classes from "./Auth.module.css";
import {useSnackbar} from "notistack";
import {convertErrorMessage} from "../../utils/convertErrorMessage";

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
	const [error, setError] = useState({})
	const {enqueueSnackbar} = useSnackbar()

	const submit = async () => {
		try {
			let data
			if (isLogin) {
				data = await login(username, password)
			} else {
				data = await registration(username, email, password, first_name, last_name)
			}
			enqueueSnackbar(MESSAGES.loggedIn, {variant: "success"})
			user.setUser(data)
			user.setIsAuth(true)
			user.setIsStaff(data.isStaff)
			setTimeout(navigate(SHOP_ROUTE), 1000)
		} catch (e) {
			enqueueSnackbar(convertErrorMessage(e), {variant: "error"})
			setError(e.response.data)
		}
	}

	return (
		<Container className={classes.auth_container}>
			<Segment style={{width: 600}}>
				<h2 className="m-auto">{isLogin ? "Authorization" : "Registration"}</h2>
				<Form>
					<Form.Input label="Login"
								value={username}
								placeholder="Login"
								error={'username' in error ? error.username[0] : false}
								onChange={e => setUsername(e.target.value)}/>
					<Form.Input type="password"
						label="Password"
						value={password}
						error={'password' in error ? error.password[0] : false}
						onChange={e => setPassword(e.target.value)}
						placeholder="Password"
					/>
					{!isLogin
						?
						<>
							<Form.Input icon={true}
										type="email"
										label="Email"
										value={email}
										control={Input}
										iconPosition="left"
										placeholder="Email"
										error={'email' in error ? error.email[0] : false}
										onChange={e => setEmail(e.target.value)}>
								<Icon name='at'/>
								<input/>
							</Form.Input>
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
	)
		;
});

export default Auth;