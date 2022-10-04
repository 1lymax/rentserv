import {useSnackbar} from "notistack";
import {observer} from "mobx-react-lite";
import React, {useContext, useEffect, useState} from 'react';

import {Button, Checkbox, Dropdown, Grid, Header, Table} from "semantic-ui-react";
import {Context} from "../../../index";
import {MESSAGES, PAGINATION} from "../../../utils/consts";
import Paginate from "../../UI/Paginate/Paginate";
import InputControl from "../../UI/InputControl/InputControl";
import DependencyShow from "../DependencyShow/DependencyShow";
import setDependencyName from "../../../utils/setDependencyName";

import {doCreate, doDelete, doFetch, doUpdate} from "../../../http/storeAPI";
import classes from "./EditTable.module.css"
import {useDebounce} from "../../../hooks/useDebounce";
import {getErrorMessage} from "../../../utils/getErrorMessage";


const EditTable = observer(({context, isDependencyTable, filters, ordering, parentContext}) => {
	const {enqueueSnackbar} = useSnackbar()
	const contextScope = useContext(Context)
	const [edit, setEdit] = useState(0)
	const [data, setData] = useState([])
	const [add, setAdd] = useState(false)
	const [error, setError] = useState([])
	const [totalRows, setTotalRows] = useState(0)
	const [needFetch, setNeedFetch] = useState([])
	const [isSaving, setIsSaving] = useState(false)
	const [currentPage, setCurrentPage] = useState(0)
	const [fieldValues, setFieldValues] = useState({})
	const [focusElement, setFocusElement] = useState([])
	const [actionButtonsVisible, setActionButtonsVisible] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(PAGINATION.rowsPerPageDefault)

	const conf = context.settings
	const pagination = {
		page: currentPage ? currentPage + 1 : undefined,
		[PAGINATION.backendName]: rowsPerPage
	}

	//eslint-disable-next-line
	useEffect(
		useDebounce(
			() => fetchFiltering(),
			500),
		[needFetch, filters, currentPage, rowsPerPage])

	function fetchFiltering() {
		doFetch(context, ordering, filters, pagination, context?.auth)
			.then(resp => {
					setData(resp.results)
					setTotalRows(resp.count)
				}
			)
			.catch(e => {
				enqueueSnackbar(getErrorMessage(e), {variant: "error"})
				setError(getErrorMessage(e.response.data))
			})
	}

	const isBoolean = (value, name) => {
		return value === true || value === false ? <Checkbox name={name} checked={value} disabled/> : value
	};

	const setCellValue = (item, set) => {
		if (set.contextName && !set.filter && contextScope[set.contextName] && contextScope[set.contextName].data.length) {
			if (isNeedDependencyValue(set.name)) {
				let result = setDependencyName(contextScope[set.contextName].data, item[set.name])
				return result && isBoolean(result.name, item.name)
			}
		} else {
			return isBoolean(item[set.name], item.name)
		}
	};

	const isNeedDependencyValue = (cellName) => {
		return !(isDependencyTable && cellName === parentContext?.selfName)
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
			setIsSaving(true)
			doUpdate(context, id, fieldValues).then(() => {
				doFetch(context).then(resp => context.setData(resp.results))
				enqueueSnackbar(MESSAGES.updateSuccess, {variant: "success"})
				setNeedFetch(Date.now())
				hideAll()
			})
				.catch(e => enqueueSnackbar(getErrorMessage(e.response.data), {variant: "error"}))
		} else if (actionButtonsVisible === 0) {
			doCreate(context, fieldValues).then(() => {
				doFetch(context).then(resp => context.setData(resp.results))
				enqueueSnackbar(MESSAGES.addSuccess, {variant: "success"})
				setNeedFetch(Date.now())
				setFieldsArray(isDependencyTable ? filters : [])
				hideAll()
			}).catch(e => {
				enqueueSnackbar(getErrorMessage(e), {variant: "error"})
				setError(getErrorMessage(e))
			})
		}

	}

	const handleDelOrCancel = (id) => {
		if (id === edit) {
			hideAll()
		} else {
			doDelete(context, id).then(() => {
				setNeedFetch(Date.now())
				enqueueSnackbar(MESSAGES.deleteSuccess, {variant: "success"})
			}).catch(e => {
				enqueueSnackbar(getErrorMessage(e), {variant: "error"})
				setError(getErrorMessage(e.response.data))
			})
		}
	}

	const handleInputChange = e => {
		let name = e.name || e.target.name
		let value = e?.value || e.target?.value
		setFieldValues(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	const hideAll = () => {
		setEdit(0)
		setActionButtonsVisible(0)
		setIsSaving(false)
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
				<Grid columns={1} verticalAlign={"bottom"}>
					<Grid.Column>
						<Paginate total={totalRows} setCurrentPage={setCurrentPage} setLimit={setRowsPerPage}/>
					</Grid.Column>
				</Grid>
			}
			<Table style={{overflow: "auto", marginTop: "1rem"}}>
				<Table.Header>
					<Table.Row>
						{conf.fields.map(set =>
							isNeedDependencyValue(set.name) &&
							<Table.HeaderCell width={set?.width} key={set.name}>
								{set.placeholder}
							</Table.HeaderCell>
						)}
						<Table.HeaderCell>Actions</Table.HeaderCell>
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
							<Table.Row
								onMouseEnter={() => setActionButtonsVisible(item.id)}
								onMouseLeave={() => setActionButtonsVisible(0)}
							>
								{conf.fields.map(set => isNeedDependencyValue(set.name) &&
									<Table.Cell key={set.name}>
										{item.id === edit
											?
											<div className={classes.cellEdit}>
												<InputControl
													fluid
													set={set}
													error={error}
													inputName={set.name}
													value={fieldValues[set.name]}
													onChange={e => handleInputChange(e)}
													handleSubmit={() => handleSubmit(item)}
													hidden={isNeedDependencyValue(set.name)}
													autoFocus={item.id === focusElement[0] && set.name === focusElement[1]}
													selectOptions={set.contextName && contextScope[set.contextName].data}
												/>
											</div>
											:
											<div className={classes.cellData} onClick={() => {
												setFieldsArray(item)
												setAdd(false)
												setFocusElement([item.id, set.name])
												setEdit(item.id)
											}}>
												{setCellValue(item, set)}
											</div>
										}
									</Table.Cell>
								)}
								<Table.Cell textAlign={"center"}>
									<Dropdown simple icon='ellipsis vertical' direction="left">
										<Dropdown.Menu>
											<Dropdown.Item
												onClick={() => handleSubmit(item)}
												icon={edit === item.id ? "save" : "edit"}
												text={edit === item.id ? "Save" : "Edit"}
											/>
											<Dropdown.Item
												onClick={() => {
													setAdd(false)
													handleDelOrCancel(item.id)
												}}
												icon={edit === item.id ? "cancel" : "trash"}
												text={edit === item.id ? "Undo changes" : "Delete record"}
											/>
										</Dropdown.Menu>
									</Dropdown>
								</Table.Cell>
							</Table.Row>
							{conf.dependencies && conf.dependencies.length > 0 &&
								<Table.Row>
									<Table.Cell colSpan={conf.fields.length + 1} className={classes.depButtonsCell}>
										<DependencyShow conf={conf} item={item} contextScope={contextScope}/>
									</Table.Cell>
								</Table.Row>
							}
						</React.Fragment>
					)}
					{add
						?
						<Table.Row>
							{conf.fields.map(set =>
								<Table.Cell key={set.name}>
									<InputControl
										add
										fluid
										set={set}
										inputName={set.name}
										value={fieldValues[set.name]}
										onChange={e => handleInputChange(e)}
										selectOptions={set.contextName && contextScope[set.contextName].data}
									/>
								</Table.Cell>
							)}

							<Table.Cell>
								<Button circular size="large" loading={isSaving} icon="save"
										onClick={() => {
											setEdit(-1)
											handleEditOrSave(undefined, fieldValues)
										}}
								/>
								<Button circular size="large" icon="cancel"
										onClick={() => setAdd(false)}/>
							</Table.Cell>
						</Table.Row>
						:
						<Table.Row>
							<Table.Cell
								colSpan={isDependencyTable ? Math.floor(conf.fields.length / 2) : conf.fields.length + 1}>
								<Button primary content='Add record' icon='add' labelPosition='left'
										onClick={() => {
											hideAll()
											setAdd(true)
											setFieldsArray(isDependencyTable ? filters : {})
										}}
								/>
							</Table.Cell>
							{!isDependencyTable ||
								<Table.Cell colSpan={conf.fields.length - Math.floor(conf.fields.length / 2)}
											className={classes.pagination__wrapper}>
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