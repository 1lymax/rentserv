import axios from "axios";
import {REACT_APP_API_CLOUD_URL} from "../utils/consts";

const API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : REACT_APP_API_CLOUD_URL

const $host = axios.create({
	baseURL: API_URL
})

const $authHost = axios.create({
	baseURL: API_URL
})

const authInterceptor = config => {
	config.headers.Authorization = 'Bearer ' + localStorage.getItem('access')
	return config
}

$authHost.interceptors.request.use(authInterceptor)

export {
	$host,
	$authHost
}