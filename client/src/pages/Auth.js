import React, {useContext, useState} from 'react';
import {Button, Card, Container, Form} from "react-bootstrap";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE} from "../utils/consts";
import {login, registration} from "../http/userAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import InlineAlert from "../components/UI/InlineAlert/InlineAlert";

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
		<Container
			className="d-flex justify-content-center align-items-center"
			style={{height: window.innerHeight - 54}}
		>
			<Card style={{width: 600}} className="p-5">
				<h2 className="m-auto">{isLogin ? "Авторизация" : "Регистрация"}</h2>
				<Form className="d-flex flex-column">
					<Form.Control
						value={username}
						onChange={e => setUsername(e.target.value)}
						className="mt-3"
						placeholder="Логин"
					/>
					<Form.Control
						value={password}
						onChange={e => setPassword(e.target.value)}
						className="mt-3"
						placeholder="Пароль"
						type="password"
					/>
					{!isLogin
						?
						<>
							<Form.Control
								value={email}
								onChange={e => setEmail(e.target.value)}
								className="mt-3"
								placeholder="Email"
								type={email}
							/>
							<Form.Control
								value={first_name}
								onChange={e => setFirstName(e.target.value)}
								className="mt-3"
								placeholder="Имя"
								type={first_name}
							/>
							<Form.Control
								value={last_name}
								onChange={e => setLastName(e.target.value)}
								className="mt-3"
								placeholder="Фамилия"
								type={last_name}
							/>
						</>
						:
						<></>

					}
					<InlineAlert
						show={alertVisible}
						setShow={setAlertVisible}
						message={alertMessage}
					/>
					<div className="d-flex justify-content-between mt-3"
					>
						{isLogin
							?
							<div>
								Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйся!</NavLink>
							</div>
							:
							<div>
								Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите</NavLink>
							</div>
						}
						<Button
							onClick={submit}
							variant={"outline-success"}
						>{isLogin ? "Войти" : "Регистрация"}</Button>
					</div>


				</Form>
			</Card>

		</Container>
	);
});

export default Auth;