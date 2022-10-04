export const getErrorMessage = (error) => {
	if ('code' in error && error.code === 'bad_authorization_header') return 'Demo mode. Any changes are prohibited.'
	let object = error?.response.data ? error.response.data : error?.message
	if ('code' in object && object.code === 'bad_authorization_header') return 'Demo mode. Any changes are prohibited.'
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