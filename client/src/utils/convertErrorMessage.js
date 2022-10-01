export const convertErrorMessage = (object) => {
	let str = ''
	console.log(typeof object)
	if (typeof object === 'object') {
		for (let key in object) {
			console.log(key)
			str += [key, ": ", object[key], " "].join("")
		}
	}
	return str
};