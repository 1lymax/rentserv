export const convertErrorMessage = (object) => {
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