import {Spinner} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import {BrowserRouter} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";

import {Context} from "./index";
import {check, refresh} from "./http/userAPI";
import NavBar from "./components/NavBar";
import AppRouter from "./components/AppRouter";

// eslint-disable-next-line
import classes from "../src/css/App.css"

const App = observer(() => {
	const {user} = useContext(Context)
	const [loading, setLoading] = useState(true)


	useEffect(() => {
		check().then(data => {
			user.setUser(data)
			user.setIsAuth(true)
			user.setIsStaff(true)
		})
			.catch(e => {
				if (e.response.data?.code === "token_not_valid") {
					localStorage.removeItem('access')
					localStorage.removeItem('refresh')
				}
			})
			.finally(() => setLoading(false))
	},)

	if (loading) {
		return <Spinner animation={"grow"}/>
	}

	setInterval(() => refresh(), 275000);

	return (
		<BrowserRouter>
			<NavBar/>
			<AppRouter/>
		</BrowserRouter>
	);
})

export default App;
