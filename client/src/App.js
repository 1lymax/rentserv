import {BrowserRouter} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {Spinner} from "react-bootstrap";

import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import {Context} from "./index";
import {check} from "./http/userAPI";
// eslint-disable-next-line
import classes from "./css/App.css"


const App = observer(() => {
	const {user} = useContext(Context)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		check().then(data => {
			console.log('userdata', data)
			user.setUser(data)
			user.setIsAuth(true)
			user.setIsStaff(data ? data.isStaff : false)
		})
			.finally(() => setLoading(false))
			.catch(e => console.log('check() catch', e))
	},)

	if (loading) {
		return <Spinner animation={"grow"}/>
	}

	return (
		<BrowserRouter>
			<NavBar/>
			<AppRouter/>
		</BrowserRouter>
	);
})

export default App;
