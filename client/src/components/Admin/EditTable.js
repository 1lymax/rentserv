import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton'
import {AddToPhotos} from "@mui/icons-material";

import setDependencyName from "../../utils/setDependencyName";
import {Context} from "../../index";
import {doCreate, doDelete, doFetch, doUpdate} from "../../http/storeAPI";
import InputControl from "../UI/InputControl/InputControl";
import OutlineButton from "../UI/OutlineButton/OutlineButton";
import DependencyShow from "./DependencyShow/DependencyShow";
import IButton from "../UI/IconButton/IButton";
import Paginate from "../UI/Paginate/Paginate";
import classes from "./EditTable.module.css"
import {PAGINATION} from "../../utils/consts";
import {Button, Header, Segment, Table} from "semantic-ui-react";


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
		// eslint-disable-next-line
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
		// eslint-disable-next-line
		conf.fields.map(field => {
			setFieldValues(prevState => ({
				...prevState,
				[field.name]: item && item[field.name] !== undefined ? item[field.name] : ''
			}));
		})
	};

	const handleEditOrSave = (id) => {
		setEdit(id)
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

	// eslint-disable-next-line
	const handleSubmit = (item) => {
		setFieldsArray(item)
		setAdd(false)
		handleEditOrSave(item.id, item.name)
	};

	return (
		<>
			{!isDependencyTable &&
				<Segment basic>
					<div>
						Фильтр
					</div>
					<div>
						<Paginate total={totalRows} setCurrentPage={setCurrentPage} setLimit={setRowsPerPage}/>
					</div>
				</Segment>
			}
			<Table fixed>
				<Table.Header>
					<Table.Row>
						{conf.fields.map(set =>
							<Table.HeaderCell key={set.name}>
								{set.placeholder}
							</Table.HeaderCell>
						)}
						<Table.HeaderCell></Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{data.length === 0 &&
						<Table.Row>
							<Table.Cell colSpan={conf.fields.length + 1} textAlign="center">
								<Header as="h3"
										color="grey" textAlign="center" content="< no data >"/>
							</Table.Cell>
						</Table.Row>
					}
					{data.length > 0 && data.map(item =>
						<React.Fragment key={item.id}>
							{/*<Table.Row className={!isDependencyTable && classes.dict__item}>*/}
							<Table.Row
								onMouseEnter={() => setActionButtonsVisible(item.id)}
								onMouseLeave={() => setActionButtonsVisible(0)}
							>
								{conf.fields.map(set =>
									<Table.Cell key={set.name} style={{minHeight: "48px"}}>
										{isNeedDependencyValue(set.name) &&
											<>
												{item.id === edit
													?
													<InputControl
														set={set}
														inputName={set.name}
														value={fieldValues[set.name]}
														onChange={e => handleInputChange(e)}
														handleSubmit={() => handleSubmit(item)}
														hidden={isNeedDependencyValue(set.name)}
														autoFocus={item.id === focusElement[0] && set.name === focusElement[1]}
														selectOptions={set.contextName && contextScope[set.contextName].data}
													/>
													:
													<div className="d-flex align-items-center"
														 style={{
															 cursor: "cell",
															 minHeight: "40px",
															 paddingLeft: "15px"
														 }}
														 onClick={() => {
															 setFieldsArray(item)
															 setAdd(false)
															 setFocusElement([item.id, set.name])
															 setEdit(item.id)
														 }}>
														{setCellValue(item, set)}
													</div>
												}
											</>
										}
									</Table.Cell>
								)}
								<Table.Cell>
									{actionButtonsVisible === item.id &&
										<>
											{isLoading
												? <LoadingButton loading/>
												: <Button circular icon={edit === item.id ? "save" : "edit"}
														  onClick={() => handleSubmit(item)}/>
											}
											<Button
												circular icon={edit === item.id ? "cancel" : "trash"}
												onClick={() => {
													setAdd(false)
													handleDelOrCancel(item.id)
												}}
											/>
										</>
									}
								</Table.Cell>
							</Table.Row>
							{conf.dependencies && conf.dependencies.length > 0 &&
								<Table.Row>
									<Table.Cell colSpan={conf.fields.length + 1}>
										<DependencyShow conf={conf} item={item} contextScope={contextScope}/>
									</Table.Cell>
								</Table.Row>
							}
						</React.Fragment>
					)}
					{add
						?
						<Table.Row className={["", isDependencyTable ? 'ms-4' : 'mb-4'].join(' ')}>
							{conf.fields.map(set =>
								<Table.Cell key={set.name}>
									<InputControl
										add
										set={set}
										inputName={set.name}
										value={fieldValues[set.name]}
										onChange={e => handleInputChange(e)}
										selectOptions={set.contextName && contextScope[set.contextName].data}
									/>
								</Table.Cell>
							)}

							<Table.Cell>
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
							</Table.Cell>
						</Table.Row>
						:
						<Table.Row>
							<Table.Cell colSpan={2}>
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
							</Table.Cell>
							{!isDependencyTable ||
								<Table.Cell className={classes.pagination__wrapper} colSpan={3}>
									<Paginate total={totalRows} setCurrentPage={setCurrentPage}
											  setLimit={setRowsPerPage}/>
								</Table.Cell>
							}
						</Table.Row>
					}
				</Table.Body>
			</Table>
		</>
	);
});

export default EditTable;