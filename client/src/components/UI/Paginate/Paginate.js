import React, {useState} from 'react';
import {TablePagination} from "@mui/material";
import {useStyles} from "./styles";
import {observer} from "mobx-react-lite";
import {PAGINATION} from "../../../utils/consts";

const Paginate = observer(({total, setCurrentPage, setLimit}) => {
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(PAGINATION.rowsPerPageDefault)
	const classes = useStyles();

	const handleChangePage = (e, newPage) => {
		setPage(newPage)
		setCurrentPage(newPage)
	}

	const handleChangeRowsPerPage = (e) => {
		setRowsPerPage(parseInt(e.target.value, 10))
		setLimit(parseInt(e.target.value, 10))
		handleChangePage({}, 0)
	};

	return (
		<TablePagination
			page={page}
			count={total}
			component="div"
			classes={classes}
			rowsPerPage={rowsPerPage}
			onPageChange={handleChangePage}
			labelRowsPerPage='Записей на страницу'
			onRowsPerPageChange={handleChangeRowsPerPage}
			rowsPerPageOptions={[5, 25, 50, 100, {value: -1, label: 'Все'}]}
			labelDisplayedRows={({ from, to, count }) => { return `${from}–${to} из ${count !== -1 ? count : `более чем ${to}`}`; }}
		/>
	);
});

export default Paginate;