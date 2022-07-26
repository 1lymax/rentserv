import {$authHost, $host} from "./index";
import jwtDecode from "jwt-decode";

export const registration = async (username, email, password, first_name, last_name) => {
	const {data} = await $host.post('user/register/', {username, email, password, first_name, last_name})
	localStorage.setItem('access', data.access)
	localStorage.setItem('refresh', data.refresh)
	return jwtDecode(data.access)
}

export const login = async (username, password) => {

	const {data} = await $host.post('user/login/', {username, password})
	localStorage.setItem('access', data.access)
	localStorage.setItem('refresh', data.refresh)

	return jwtDecode(data.access)

}

export const check = async () => {
	try {
		if (localStorage.access) {
			await $authHost.post('user/token/verify/', {token: localStorage.access});
			return jwtDecode(localStorage.access);
		}
		return {}
	} catch (e) {
		return refresh()
	}
}

export const refresh = async () => {
	if (localStorage.refresh) {
		const {data} = await $authHost.post('user/token/refresh/', {refresh: localStorage.refresh});
		localStorage.setItem('access', data.access)
		return jwtDecode(data.access)
	}
	return {}
};