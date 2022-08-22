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
				name: 'name', type: 'string', placeholder: 'Название', width: '250px', cssClassName: "col-4"
			},
			{
				name: 'vehicle_type', type: 'select', placeholder: 'Тип', contextName: 'types', width: '180px', cssClassName: "col-3"
			},
			{
				name: 'price_cap', type: 'string', placeholder: 'Цена (Столица)', width: '80px', cssClassName: "col-1"
			},
			{
				name: 'price_region', type: 'string', placeholder: 'Цена (Регионы)', width: '80px', cssClassName: "col-1"
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