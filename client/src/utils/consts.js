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
	vehicleImage: 'vehicleImage',
	vehicleFeature: 'vehicle_feature',
	city: 'city',
	store: 'store',
}

export const ADMIN = {
	newImage: process.env.REACT_APP_API_URL+'media/image.png',

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
	vehicleImage: {
		title: 'Изображения',
		imageContent: true,
		maxImages: 10,
		selfName: 'vehicleImage',
		addButtonTitle: '+ изо',
		fields: [
			{
				name: 'image', type: 'string', placeholder: 'Изображение', cssClassName: "col-10"
			},
			{
				name: 'vehicle', type: 'select', placeholder: 'Транспорт'
			},
		]
	},
	vehicleFeature: {
		title: 'Характеристики транспортных средств',
		selfName: 'vehicleFeature',
		addButtonTitle: '+ характиристика',
		dependsOn: 'vehicle',
		fields: [
			{
				name: 'feature', backendFiltersetField: 'features__feature', type: 'select', placeholder: 'Характеристика', contextName: 'feature', cssClassName: "col-5 col-lg-4"
			},
			{
				name: 'value', backendFiltersetField: 'features__value', type: 'string', placeholder: 'Величина', cssClassName: "col-2"
			},
			{
				name: 'unit', backendFiltersetField: 'features__unit', type: 'select', placeholder: 'Ед. изм.', contextName: 'unit', cssClassName: "col-2"
			},
			{
				name: 'vehicle', type: 'select', placeholder: 'Транспорт', contextName: 'vehicle', cssClassName: "col-3 col-lg-2"
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
			{name: 'vehicleFeature', field: 'vehicle', inlineTitle: 'Характеристики'},
			{name: 'store', field: 'vehicle', inlineTitle: 'Наличие'},
			{name: 'vehicleImage', field: 'vehicle', inlineTitle: 'Изображения'},
		],
		fields: [
			{
				name: 'name', type: 'string', placeholder: 'Название', cssClassName: "col-4 col-lg-3 flex-grow-1"
			},
			{
				name: 'vehicle_type', type: 'select', placeholder: 'Тип', contextName: 'type', cssClassName: "col-4 col-lg-3"
			},
			{
				name: 'price_cap', type: 'string', placeholder: 'Цена (Столица)', width: '80px', cssClassName: "col-2"
			},
			{
				name: 'price_region', type: 'string', placeholder: 'Цена (Регионы)', width: '80px', cssClassName: "col-2"
			},
		]
	},
	store: {
		title: 'Склады',
		selfName: 'store',
		addButtonTitle: '+ на склад',
		dependsOn: 'city',
		dependencies: [
			//{name: 'city', field: 'city', inlineTitle: 'Наличие'},
		],
		fields: [
			{
				name: 'vehicle', type: 'select', placeholder: 'Транспорт', contextName: 'vehicle', cssClassName: "col-4 col-lg-3"
			},
			{
				name: 'city', type: 'select', backendFiltersetField: 'store__city', placeholder: 'Город', contextName: 'city', cssClassName: "col-4 col-lg-3"
			},
			{
				name: 'quantity', type: 'string', placeholder: 'Кол-во', cssClassName: "col-4 col-lg-3"
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
		dependencies: [
			{name: 'store', field: 'city', inlineTitle: 'Наличие'},
		],
		fields: [
			{
				name: 'name', type: 'string', placeholder: 'Название города', cssClassName: "col-6 col-lg-5"
			},
		]
	}
}