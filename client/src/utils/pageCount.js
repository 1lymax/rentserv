export const pageCount = (rowsCount, rowsPerPage) => {
	let totalPages = Math.floor(rowsCount / rowsPerPage)
	totalPages += rowsCount % rowsPerPage > 0 ? 1 : 0
	return totalPages
};