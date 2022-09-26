import {$host, $authHost} from "./index";
import jwtDecode from "jwt-decode";

export const registration = async (username, email, password, first_name, last_name) => {

	const {data} = await $host.post('user/register/', {username, email, password, first_name, last_name})
	localStorage.setItem('access', data.access)
	localStorage.setItem('refresh', data.refresh)
	return jwtDecode(data.access)
}

export const login = async (username, password) => {
	const {data} = await $host.post('user/login/', {username, password})
	//console.log("login() data", data)
	localStorage.setItem('access', data.access)
	localStorage.setItem('refresh', data.refresh)
	//onAuthorize(data.access)
	//console.log('localstorage', localStorage)
	return jwtDecode(data.access)

}

export const check = async () => {
	try {
		if (localStorage.access) {
			const {data} = await $authHost.post('user/token/verify/', {token: localStorage.access});
			if (data === {}) {
				console.log(jwtDecode(localStorage.access))
				return jwtDecode(localStorage.access);
			}
		}
		return {}
	} catch (e) {
		const {data} = await $authHost.post('user/token/refresh/', {refresh: localStorage.refresh})
		localStorage.setItem('access', data.access)
		//console.log('refresh data', data)
		return jwtDecode(data.access)

	}


}