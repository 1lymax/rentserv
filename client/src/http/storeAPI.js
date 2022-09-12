import {$authHost, $host} from "./index";
import {API_ROUTES} from "../utils/consts";


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
	try{
		const {data} = await $host.get(
			API_ROUTES.api + context.endpoint + '/',
			{params:
					{
						...ordering,
						...filters,
						...pagination
					}
			})
		return data
	}catch (e){
		console.log('doFetch error', e.response.data)
	}


}

export const doDelete = async (context, id) => {
	const {data} = await $authHost.delete(API_ROUTES.api + context.endpoint + '/' + id + '/')
	return data
}

export const addToCart = async (id, params) => {
	return await $host.post('cart/add/' + id + '/', params).data

};