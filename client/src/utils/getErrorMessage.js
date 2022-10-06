export const getErrorMessage = (error) => {
	console.log('error', error)
	if ('code' in error && ['bad_authorization_header', 'token_not_valid'].includes(error.code)) return 'Demo mode. Changes not allowed.'
	let object = error?.response.data ? error.response.data : error?.message
	if ('code' in object && ['bad_authorization_header', 'token_not_valid'].includes(object.code)) return 'Demo mode. Changes not allowed.'
	let str = ''
	if (typeof object === "string") {
		return object
	}
	if (typeof object === 'object') {
		for (let key in object) {
			str += [key.length > 1 ? key + ":" : '', object[key], " "].join("")
		}
	}
	return str
};