const setDependencyName = (a, idToSearch) => {
	a = a.filter(item => {
		return item.id === idToSearch
	})
	return a[0]
}

export default setDependencyName;