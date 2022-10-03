export const ADMIN_ROUTE = '/admin'
export const LOGIN_ROUTE = '/login'
export const REGISTRATION_ROUTE = '/registration'
export const SHOP_ROUTE = '/shop'
export const MAIN_ROUTE = '/'
export const ITEMDETAIL_ROUTE = '/detail'
export const REACT_APP_API_CLOUD_URL='https://rentserv-api.herokuapp.com/'

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
	cart: 'cart'
}

export const MESSAGES = {
	addSuccess: 'Successfully added!',
	updateSuccess: 'Successfully updated!',
	deleteSuccess: 'Successfully deleted!',
	loggedIn: 'Login success!',
	cartAdd: 'Added to cart!',
	cartRemove: 'Removed from cart'
}

export const PAGINATION = {
	backendName: 'page_size',
	rowsPerPageDefault: 5
}

export const ADMIN = {
	newImage: process.env.REACT_APP_API_URL+'media/image.png',
	imageCardWidth: 200,
	imageCardHeight: 200,

	type: {
		title: 'Типы транспортных средств',
		selfName: 'type',
		addButtonTitle: '+ тип',
		fields: [
			{
				name: 'name', type: 'string', placeholder: 'Название'
			},
		]
	},
	vehicleImage: {
		title: 'Изображения',
		imageContent: true,
		maxImages: 10,
		selfName: 'vehicleImage',
		dependsOn: 'vehicle',
		addButtonTitle: '+ изо',
		fields: [
			{
				name: 'image', type: 'string', placeholder: 'Изображение'
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
				name: 'feature', backendFiltersetField: 'features__feature',
				type: 'select', placeholder: 'Характеристика', contextName: 'feature', width: 6
			},
			{
				name: 'value', backendFiltersetField: 'features__value', filterStyles: {minWidth: '70px', maxWidth: '100px'},
				type: 'string', placeholder: 'Величина', width: 2
			},
			{
				name: 'unit', backendFiltersetField: 'features__unit', type: 'select', filterStyles: {minWidth: '120px', maxWidth: '140px'},
				placeholder: 'ед.', contextName: 'unit', width: 2
			},
			{
				name: 'vehicle', type: 'select', placeholder: 'Транспорт', contextName: 'vehicle'
			},
		]
	},
	feature: {
		title: 'Характеристики',
		selfName: 'feature',
		addButtonTitle: '+ характеристика',
		fields: [
			{
				name: 'name', type: 'string', placeholder: 'Характеристика'
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
				name: 'name', type: 'string', filter: 'autocomplete', filterStyles: {minWidth: '150px'},
				contextName: 'vehicle', placeholder: 'Название', width: 5
			},
			{
				name: 'vehicle_type', type: 'select', placeholder: 'Тип', filterStyles: {minWidth: '170px', maxWidth: '220px'},
				contextName: 'type', width: 5
			},
			{
				name: 'price_cap', type: 'string', filter: 'slider', aggregateContext: 'vehicle',
				placeholder: 'Цена (Столица)', width: 2,
			},
			{
				name: 'price_region', type: 'string', filter: 'slider', aggregateContext: 'vehicle',
				placeholder: 'Цена (Регионы)', width: 2
			},
		],
		filterAdditionalfields: [
			{
				name: 'city', type: 'select', backendFiltersetField: 'store__city', placeholder: 'Наличие (город)', contextName: 'city', width: 6
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
				name: 'vehicle', type: 'select', placeholder: 'Транспорт', contextName: 'vehicle', filterStyles: {maxWidth: '170px'}, width: 6
			},
			{
				name: 'city', type: 'select', backendFiltersetField: 'store__city', placeholder: 'Город', contextName: 'city', width: 6
			},
			{
				name: 'quantity', type: 'string', backendFiltersetField: 'store__quantity', filter: 'slider', aggregateContext: 'store',
				placeholder: 'Кол-во', filterStyles: {maxWidth: '90px'}, width: 2
			},
		]
	},
	unit: {
		title: 'Единицы измерения',
		selfName: 'unit',
		addButtonTitle: '+ ед. изм.',
		fields: [
			{
				name: 'name', type: 'string', placeholder: 'Ед. изм.', filterStyles: {minWidth: '70px', maxWidth: '100px'},
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
				name: 'name', type: 'string', filter: 'autocomplete', filterStyles: {minWidth: '180px'},
				contextName: 'city', placeholder: 'Название города', width:5
			},
		]
	}
}