import {$authHost, $host} from "./index";
import {API_ROUTES} from "../utils/consts";

const removeEmpties = (data) => {
	for (let key in data) {
		data[key] === '' &&	delete data[key]
	}
	return data
};

export const doUpdate = async (context, id, updateData) => {
	const {data} = await $authHost.put(API_ROUTES.api + context.endpoint + '/' + id + '/', updateData)
	return data
}

export const fetchOneVehicle = async (id) => {
	const {data} = await $host.get(API_ROUTES.api + API_ROUTES.vehicle + '/' + id + '/')
	return data
}

export const doCreate = async (context, createData) => {
	const {data} = await $authHost.post(API_ROUTES.api + context.endpoint + '/', createData)
	return data
}

export const doFetch = async (context, ordering, filters, pagination) => {
		const {data} = await $host.get(
			API_ROUTES.api + context.endpoint + '/',
			{params:
					{
						...removeEmpties(ordering),
						...removeEmpties(filters),
						...removeEmpties(pagination)
					}
			})
		return data
}

export const doDelete = async (context, id) => {
	const {data} = await $authHost.delete(API_ROUTES.api + context.endpoint + '/' + id + '/')
	return data
}

export const addToCart = async (id, params) => {
	const {data} = await $host.post('cart/add/' + id + '/', params, {withCredentials: true})
	return data.cart
};

export const removeFromCart = async (id) => {
	const {data} = await $host.delete('cart/remove/' + id + '/',{withCredentials: true})
	return data.cart
};

export const fetchCart = async () => {
	const {data} = await $host.get(API_ROUTES.cart + '/', {withCredentials: true})
	return data.cart

};