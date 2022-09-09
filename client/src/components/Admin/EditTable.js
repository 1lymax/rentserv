import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Col, Container, Row} from "react-bootstrap";

import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton'
import {AddToPhotos} from "@mui/icons-material";

import setDependencyName from "../../utils/setDependencyName";
import {Context} from "../../index";
import {doCreate, doDelete, doFetch, doUpdate} from "../../http/storeAPI";
import InputControl from "../UI/InputControl/InputControl";
import OutlineButton from "../UI/OutlineButton/OutlineButton";
import DependencyShow from "./DependencyShow";
import IButton from "../UI/IconButton/IButton";
import Paginate from "../UI/Paginate/Paginate";
import classes from "./EditTable.module.css"
import {PAGINATION} from "../../utils/consts";


const EditTable = observer(({context, isDependencyTable, filters, ordering, parentContext}) => {
	const [add, setAdd] = useState(false)
	const [edit, setEdit] = useState(0)
	const [data, setData] = useState([])
	const [currentPage, setCurrentPage] = useState(0)
	const [totalRows, setTotalRows] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(PAGINATION.rowsPerPageDefault)
	const [isLoading, setIsLoading] = useState(false)
	const [needFetch, setNeedFetch] = useState([])
	const [fieldValues, setFieldValues] = useState({})
	const [actionButtonsVisible, setActionButtonsVisible] = useState(0)
	const [focusElement, setFocusElement] = useState([])
	const contextScope = useContext(Context)
	const conf = context.settings
	const pagination = {
		page: currentPage ? currentPage + 1 : undefined,
		[PAGINATION.backendPageSize]: rowsPerPage
	}

	useEffect(() => {
		doFetch(context, ordering, filters, pagination)
			.then(resp => {
					setData(resp.results)
					setTotalRows(resp.count)
				}
			)
	}, [needFetch, filters, currentPage, rowsPerPage]);

	const setCellValue = (item, set) => {
		if (set.contextName && !set.filter && contextScope[set.contextName] && contextScope[set.contextName].data.length) {
			if (isNeedDependencyValue(set.name)) {
				let result = setDependencyName(contextScope[set.contextName].data, item[set.name])
				return result && result.name
			}
		} else {
			return item[set.name]
		}

	};

	const isNeedDependencyValue = (CellName) => {
		const isParent = typeof parentContext !== 'undefined' && CellName === parentContext.selfName
		return !isDependencyTable || !isParent
	};

	const setFieldsArray = (item) => {
		conf.fields.map(field => {
			setFieldValues(prevState => ({
				...prevState,
				[field.name]: item && item[field.name] !== undefined ? item[field.name] : ''
			}));
		})
	};

	const handleEditOrSave = (id) => {
		setEdit(id)
		console.log('id', id, 'edit', edit)
		if (id === edit && id) {
			setIsLoading(true)
			doUpdate(context, id, fieldValues).then(() => {
				doFetch(context).then(resp => context.setData(resp.results))
				setNeedFetch(Date.now())
				hideAll()
			}).catch(e => {
				console.log(e.response.data)
			});
		} else if (actionButtonsVisible === 0) {
			doCreate(context, fieldValues).then(() => {
				doFetch(context).then(resp => context.setData(resp.results))
				setNeedFetch(Date.now())
				setFieldsArray(isDependencyTable ? filters : [])
				hideAll()
			})
		}

	}

	const handleDelOrCancel = (id) => {
		if (id === edit) {
			hideAll()
		} else {
			doDelete(context, id).then(() => {
				setNeedFetch(Date.now())
			})
		}
	}

	const handleInputChange = e => {
		let name = e.name || e.target.name
		let value = e.value || e.target.value
		setFieldValues(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	const hideAll = () => {
		setEdit(0)
		setActionButtonsVisible(0)
		setIsLoading(false)
	};

	const handleSubmit = (item, e) => {
		console.log(e)
		setFieldsArray(item)
		setAdd(false)
		handleEditOrSave(item.id, item.name)
	};

	return (
		<>
			{!isDependencyTable &&
				<>
					<Row className="d-flex align-items-center">
						<Col md={6}>
							Фильтр
						</Col>
						<Col md={6}>
							<Paginate total={totalRows} setCurrentPage={setCurrentPage} setLimit={setRowsPerPage}/>
						</Col>
					</Row>
					<Row className={["", classes.dict__title].join(' ')}>
						{conf.fields.map(set =>
							<Col key={set.name} className={["", set.cssClassName].join(' ')}
							>
								{set.placeholder}
							</Col>
						)}
						<Col className="col-1"></Col>
					</Row>
				</>
			}
			{data.length === 0 &&
				<div className="d-flex justify-content-center m-1 text-black-50">
					<h5>Данные отстуствуют</h5>
				</div>
			}
			{data.length > 0 && data.map(item =>
				<Container key={item.id} className={["",].join(' ')}>
					<Row className={!isDependencyTable && classes.dict__item}>
						<Row
							className={["d-flex align-items-center", isDependencyTable && 'ms-4'].join(' ')}
							onMouseEnter={() => setActionButtonsVisible(item.id)}
							onMouseLeave={() => setActionButtonsVisible(0)}
						>
							{conf.fields.map(set =>
								<React.Fragment key={set.name}>
									{isNeedDependencyValue(set.name)
										? <Col className={["", set.cssClassName].join(' ')}
											   style={{minHeight: "48px"}}
										>
											{item.id === edit
												?
												<InputControl
													set={set}
													inputName={set.name}
													value={fieldValues[set.name]}
													onChange={e => handleInputChange(e)}
													handleSubmit={(e) => handleSubmit(item, e)}
													hidden={isNeedDependencyValue(set.name)}
													autoFocus={item.id === focusElement[0] && set.name === focusElement[1]}
													selectOptions={set.contextName && contextScope[set.contextName].data}
												/>
												:
												<div className="d-flex align-items-center"
													 style={{cursor: "cell", minHeight: "40px", paddingLeft: "15px"}}
													 onClick={() => {
														 setFieldsArray(item)
														 setAdd(false)
														 setFocusElement([item.id, set.name])
														 setEdit(item.id)
													 }}>
													{setCellValue(item, set)}
												</div>

											}
										</Col>
										: ''
									}
								</React.Fragment>
							)}

							{actionButtonsVisible === item.id
								?
								<Col className={"col-12 d-flex flex-row justify-content-end pe-1"} lg={1}>
									{isLoading
										? <LoadingButton loading/>
										: <IButton onClick={() => handleSubmit(item)}>
											{edit === item.id ? <SaveIcon/> : <EditIcon/>}
										</IButton>
									}
									< IButton onClick={() => {
										setAdd(false)
										handleDelOrCancel(item.id)
									}}
									>
										{edit === item.id ? <CancelIcon/> : <DeleteIcon/>}
									</IButton>
								</Col>
								:
								<Col className={"col-lg-1"}></Col>
							}
						</Row>
						{}
						<DependencyShow conf={conf} item={item} contextScope={contextScope}/>
					</Row>
				</Container>
			)}
			{add
				?
				<Row
					className={["pt-2 pb-2 d-flex align-items-center", isDependencyTable ? 'ms-4' : 'mb-4'].join(' ')}>
					{conf.fields.map(set =>
						<Col
							key={set.name}
							className={["", set.cssClassName].join(' ')}
						>
							<InputControl
								add
								set={set}
								inputName={set.name}
								value={fieldValues[set.name]}
								onChange={e => handleInputChange(e)}
								selectOptions={set.contextName && contextScope[set.contextName].data}
							/>
						</Col>
					)}

					<Col className={"col-12 d-flex flex-row justify-content-end pe-1"} lg={1}>
						{isLoading
							? <LoadingButton loading/>
							: <IButton onClick={() => {
								setEdit(-1)
								handleEditOrSave(undefined, fieldValues)
							}}
							>
								<SaveIcon/>
							</IButton>
						}
						<IButton onClick={() => setAdd(false)}><CancelIcon/></IButton>
					</Col>

				</Row>
				:
				<Row className={["mb-1 d-flex align-items-center", isDependencyTable && 'ms-5'].join(' ')}>
					<Col>
						<OutlineButton
							//size="small"
							startIcon={<AddToPhotos/>}
							style={{minWidth: "120px", width: "20%"}}
							onClick={() => {
								setIsLoading(true)
								setFieldsArray(isDependencyTable ? filters : {})
								setAdd(true)
								hideAll()
							}}
						>
							Добавить{/*conf.addButtonTitle*/}
						</OutlineButton>
					</Col>
					{!isDependencyTable ||
						<Col className={classes.pagination__wrapper}>
							<Paginate total={totalRows} setCurrentPage={setCurrentPage} setLimit={setRowsPerPage}/>
						</Col>
					}
				</Row>
			}
		</>
	);
});

export default EditTable;