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
	cart: 'cart',
	order: 'order'
}

export const MESSAGES = {
	addSuccess: 'Successfully added!',
	updateSuccess: 'Successfully updated!',
	deleteSuccess: 'Successfully deleted!',
	loggedIn: 'Login success!',
	cartAdd: 'Added to cart.',
	cartUpdated: 'Cart updated.',
	cartRemove: 'Removed from cart.'
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
		title: 'Vehicle types',
		selfName: 'type',
		addButtonTitle: '+ type',
		fields: [
			{
				name: 'name', type: 'string', placeholder: 'Name'
			},
		]
	},
	vehicleImage: {
		title: 'Images',
		imageContent: true,
		maxImages: 10,
		selfName: 'vehicleImage',
		dependsOn: 'vehicle',
		addButtonTitle: '+ image',
		fields: [
			{
				name: 'image', type: 'string', placeholder: 'Image'
			},
			{
				name: 'vehicle', type: 'select', placeholder: 'Vehicle'
			},
		]
	},
	vehicleFeature: {
		title: 'Vehicle Features',
		selfName: 'vehicleFeature',
		addButtonTitle: '+ feature',
		dependsOn: 'vehicle',
		fields: [
			{
				name: 'feature', backendFiltersetField: 'features__feature',
				type: 'select', placeholder: 'Feature', contextName: 'feature', width: 6
			},
			{
				name: 'value', backendFiltersetField: 'features__value', filterStyles: {minWidth: '70px', maxWidth: '100px'},
				type: 'string', placeholder: 'Value', width: 2
			},
			{
				name: 'unit', backendFiltersetField: 'features__unit', type: 'select', filterStyles: {minWidth: '120px', maxWidth: '140px'},
				placeholder: 'unit', contextName: 'unit', width: 2
			},
			{
				name: 'vehicle', type: 'select', placeholder: 'Vehicle', contextName: 'vehicle'
			},
		]
	},
	feature: {
		title: 'Features',
		selfName: 'feature',
		addButtonTitle: '+ feature',
		fields: [
			{
				name: 'name', type: 'string', placeholder: 'Feature'
			},
		]
	},
	vehicle: {
		title: 'Vehicle',
		addButtonTitle: '+ vehicle',
		selfName: 'vehicle',
		dependencies: [
			{name: 'vehicleFeature', field: 'vehicle', inlineTitle: 'Features'},
			{name: 'store', field: 'vehicle', inlineTitle: 'Stock'},
			{name: 'vehicleImage', field: 'vehicle', inlineTitle: 'Images'},
		],
		fields: [
			{
				name: 'name', type: 'autocomplete', filter: 'autocomplete', filterStyles: {minWidth: '150px'},
				contextName: 'vehicle', placeholder: 'Name', width: 4
			},
			{
				name: 'vehicle_type', type: 'select', placeholder: 'Type', filterStyles: {minWidth: '170px', maxWidth: '220px'},
				contextName: 'type', width: 4
			},
			{
				name: 'price_cap', type: 'string', filter: 'slider', aggregateContext: 'vehicle',
				placeholder: 'Price (Capital)', width: 2, filterStyles: {minWidth: '220px', maxWidth: '240px'}
			},
			{
				name: 'price_region', type: 'string', filter: 'slider', aggregateContext: 'vehicle',
				placeholder: 'Price (Regions)', width: 2, filterStyles: {minWidth: '220px', maxWidth: '240px'}
			},
			{
				name: 'discount', type: 'string', placeholder: '%', width: 2, filterStyles: {display: 'none'},
			},
			{
				name: 'sale', type: 'checkbox', filter: 'checkbox',	placeholder: 'Sale', width: 1
			},
		],
		filterAdditionalfields: [
			{
				name: 'city', type: 'select', backendFiltersetField: 'store__city', placeholder: 'Stock (city)', contextName: 'city', width: 6
			},
		]
	},
	store: {
		title: 'Stores',
		selfName: 'store',
		addButtonTitle: '+ на склад',
		dependsOn: 'city',
		dependencies: [
			{name: 'store', field: 'vehicle', inlineTitle: 'Vehicles available'},
		],
		fields: [
			{
				name: 'vehicle', type: 'select', placeholder: 'Vehicle', contextName: 'vehicle', filterStyles: {maxWidth: '170px'}, width: 6
			},
			{
				name: 'city', type: 'select', backendFiltersetField: 'store__city', placeholder: 'City', contextName: 'city', width: 6
			},
			{
				name: 'quantity', type: 'string', backendFiltersetField: 'store__quantity', filter: 'slider', aggregateContext: 'store',
				placeholder: 'Quantity', filterStyles: {maxWidth: '90px'}, width: 2
			},
		]
	},
	unit: {
		title: 'Units',
		selfName: 'unit',
		addButtonTitle: '+ unit',
		fields: [
			{
				name: 'name', type: 'string', placeholder: 'Unit', filterStyles: {minWidth: '70px', maxWidth: '100px'},
			},
		]
	},
	city: {
		title: 'Cities',
		selfName: 'city',
		addButtonTitle: '+ city',
		dependencies: [
			{name: 'store', field: 'city', inlineTitle: 'Stock'},
		],
		fields: [
			{
				name: 'name', type: 'autocomplete', filter: 'autocomplete', filterStyles: {minWidth: '180px'},
				contextName: 'city', placeholder: 'City name', width:5
			},
		]
	},
	order: {
		title: 'Orders',
		selfName: 'order',
		dependencies: [],
		fields: [
			{
				name: 'first_name', type: 'sting', filter: 'autocomplete', contextName: 'order', placeholder: 'First name',
				width: 3
			},
			{
				name: 'last_name', type: 'sting', filter: 'autocomplete', contextName: 'order', placeholder: 'Last name',
				width: 3
			},
			{
				name: 'email', type: 'sting', filter: 'autocomplete', contextName: 'order', placeholder: 'Email',
				width: 2
			},
			{
				name: 'phone', type: 'sting', filter: 'autocomplete', contextName: 'order', placeholder: 'Phone',
				width: 2
			},
			{
				name: 'city', type: 'select', contextName: 'city', placeholder: 'City',
				width: 2
			},
			{
				name: 'paid', type: 'checkbox', filter: 'checkbox', placeholder: 'Paid',
				width: 1
			},
			{
				name: 'done', type: 'checkbox', filter: 'checkbox', placeholder: 'Done',
				width: 1
			}
		]
	}
}