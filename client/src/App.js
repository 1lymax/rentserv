import {BrowserRouter} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import {observer} from "mobx-react-lite";
import {Context} from "./index";
import {check} from "./http/userAPI";
import {Spinner} from "react-bootstrap";

const App = observer(() => {
	const {user} = useContext(Context)
	const [loading, setLoading] = useState(true)


	useEffect(() => {
		check().then(data => {
			console.log('userdata', data)
			user.setUser(data)
			user.setIsAuth(true)
			user.setIsStaff(data.isStaff)
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
