export const convertErrorMessage = (error) => {
	let object = error?.response.data ? error.response.data : error?.message
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