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
		selfName: 'type',
		addButtonTitle: '+ тип',
		fields: [
			{
				name: 'name', type: 'string', placeholder: 'Название', cssClassName: "col-10"
			},
		]
	},
	vehicleFeatures: {
		title: 'Характеристики транспортных средств',
		selfName: 'vehicleFeatures',
		addButtonTitle: '+ характиристика',
		dependsOn: 'vehicle',
		fields: [
			{
				name: 'feature', backendFiltersetField: 'features__feature', type: 'select', placeholder: 'Характеристика', contextName: 'features', cssClassName: "col-5 col-lg-4"
			},
			{
				name: 'value', backendFiltersetField: 'features__value', type: 'string', placeholder: 'Величина', cssClassName: "col-2"
			},
			{
				name: 'unit', backendFiltersetField: 'features__unit', type: 'select', placeholder: 'Ед. изм.', contextName: 'units', cssClassName: "col-2"
			},
			{
				name: 'vehicle', type: 'select', placeholder: 'Транспорт', contextName: 'vehicles', cssClassName: "col-3 col-lg-2"
			},
		]
	},
	feature: {
		title: 'Характеристики',
		selfName: 'feature',
		addButtonTitle: '+ характеристика',
		fields: [
			{
				name: 'name', type: 'string'
			},
		]
	},
	vehicle: {
		title: 'Транспорт',
		addButtonTitle: '+ транспорт',
		selfName: 'vehicle',
		dependencies: [
			{name: 'vehicleFeatures', field: 'vehicle', inlineTitle: 'Характеристики'},
		],
		fields: [
			{
				name: 'name', type: 'string', placeholder: 'Название', cssClassName: "col-4 col-lg-3"
			},
			{
				name: 'vehicle_type', type: 'select', placeholder: 'Тип', contextName: 'types', cssClassName: "col-4 col-lg-3"
			},
			{
				name: 'price_cap', type: 'string', placeholder: 'Цена (Столица)', width: '80px', cssClassName: "col-2"
			},
			{
				name: 'price_region', type: 'string', placeholder: 'Цена (Регионы)', width: '80px', cssClassName: "col-2"
			},
		]
	},
	unit: {
		title: 'Единицы измерения',
		selfName: 'unit',
		addButtonTitle: '+ ед. изм.',
		fields: [
			{
				name: 'name', type: 'string'
			},
		]
	},
	city: {
		title: 'Города',
		selfName: 'city',
		addButtonTitle: '+ город',
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