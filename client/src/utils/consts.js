export const ADMIN_ROUTE = '/admin'
export const LOGIN_ROUTE = '/login'
export const REGISTRATION_ROUTE = '/registration'
export const SHOP_ROUTE = '/'
export const ITEMDETAIL_ROUTE = '/detail'

export const API_ROUTES = {
	api: 'api/',
	type: 'type',
	feature: 'feature',
	vehicle: 'vehicle',
	unit: 'unit',
	vehicleFeature: 'vehicle_feature',
	city: 'city',
	store: 'store',
}

export const ADMIN = {
	type: {
		title: 'Типы транспортных средств',
		fields: [
			{
				name: 'name', type: 'string', placeholder: 'Название'
			},
			{
				name: 'type', type: 'string', placeholder: 'Тип'
			},
		]
	},
	feature: {
		title: 'Характеристики',
		fields: [
			{
				name: 'name', type: 'string'
			},
		]
	},
	vehicle: {
		title: 'Транспорт',
		fields: [
			{
				name: 'name', type: 'string', placeholder: 'Название'
			},
			{
				name: 'vehicle_type', type: 'string', placeholder: 'Тип'
			},
		]
	},
	unit: {
		title: 'Единицы измерения',
		fields: [
			{
				name: 'name', type: 'string'
			},
		]
	},
	city: {
		title: 'Города',
		fields: [
			{
				name: 'name', type: 'string'
			},
		]
	},
	store: {
		title: 'Склады',
	}
}