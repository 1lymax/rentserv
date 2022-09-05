import React, {useContext, useEffect, useState} from 'react';
import {Col, Container, Row} from "react-bootstrap";

import {doCreate, doDelete, doFetch, doUpdate} from "../../http/storeAPI";
import InputControl from "../UI/Admin/InputControl";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import setDependencyName from "../../utils/setDependencyName";
import OutlineButton from "../UI/OutlineButton/OutlineButton";
import classes from "./EditTable.module.css"
import {IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton'
import {AddToPhotos} from "@mui/icons-material";
import DependencyShow from "./DependencyShow";


const EditTable = observer(({context, isDependencyTable, filters, ordering, parentContext}) => {
	const [add, setAdd] = useState(false)
	const [edit, setEdit] = useState(0)
	const [data, setData] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [needFetch, setNeedFetch] = useState([])
	const [fieldValues, setFieldValues] = useState({})
	const [inputVisible, setInputVisible] = useState(0)
	const [focusElement, setFocusElement] = useState([])
	const contextScope = useContext(Context)
	const conf = context.settings

	useEffect(() => {
		doFetch(context, ordering, filters)
			.then(resp => setData(resp.results))

	}, [needFetch, filters]);

	const setCellValue = (item, set) => {
		if (set.contextName && contextScope[set.contextName] && contextScope[set.contextName].data.length) {
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
		if (id === edit && id) {
			setIsLoading(true)
			doUpdate(context, id, fieldValues).then(() => {
				doFetch(context).then(resp => context.setData(resp.results))
				setNeedFetch(Date.now())
				hideAll()
			}).catch(e => {
				console.log(e.response.data)
			});
		} else if (inputVisible === 0) {
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
		setInputVisible(0)
		setIsLoading(false)
	};

	return (
		<>
			{!isDependencyTable &&
				<Row className={["", classes.dict__title].join(' ')}>
					{conf.fields.map(set =>
						<Col key={set.name} className={["", set.cssClassName].join(' ')}
						>
							{set.placeholder}
						</Col>
					)}
					<Col className="col-1"></Col>
				</Row>
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
							onMouseEnter={() => setInputVisible(item.id)}
							onMouseLeave={() => setInputVisible(0)}
						>
							{conf.fields.map(set =>
								<React.Fragment key={set.name}>
									{isNeedDependencyValue(set.name)
										? <Col className={["", set.cssClassName].join(' ')}>
											{item.id === edit
												?
												<InputControl
													inputName={set.name}
													onChange={e => handleInputChange(e)}
													hidden={isNeedDependencyValue(set.name)}
													value={fieldValues[set.name]}
													autoFocus={item.id === focusElement[0] && set.name === focusElement[1]}
													set={set}
													selectOptions={set.contextName && contextScope[set.contextName].data}
												/>
												:
												<div className="m-1 p-1" style={{cursor: "cell"}}
													 onClick={() => {
														 setFieldsArray(item)
														 setAdd(false)
														 setFocusElement([item.id, set.name])
														 handleEditOrSave(item.id, set)
													 }}>
													{setCellValue(item, set)}
												</div>

											}
										</Col>
										: ''
									}
								</React.Fragment>
							)}

							{inputVisible === item.id
								?
								<Col className={"col-12 d-flex flex-row justify-content-end pe-1"} lg={1}>
									{isLoading
										? <LoadingButton loading/>
										: <IconButton onClick={() => {
											setFieldsArray(item)
											setAdd(false)
											handleEditOrSave(item.id, item.name)
										}}
										>
											{edit === item.id ? <SaveIcon/> : <EditIcon/>}
										</IconButton>
									}
									< IconButton onClick={() => {
										setAdd(false)
										handleDelOrCancel(item.id)
									}}
									>
										{edit === item.id ? <CancelIcon/> : <DeleteIcon/>}
									</IconButton>
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
							: <IconButton onClick={() => {
								setEdit(-1)
								handleEditOrSave(undefined, fieldValues)
							}}
							>
								<SaveIcon/>
							</IconButton>
						}
						<IconButton onClick={() => setAdd(false)}><CancelIcon/></IconButton>
					</Col>

				</Row>
				:
				<Row className={["mb-1", isDependencyTable && 'ms-5'].join(' ')}>
					<OutlineButton
						size="small"
						startIcon={<AddToPhotos/>}
						style={{minWidth: "50px", width: "20%"}}
						onClick={() => {
							setIsLoading(true)
							setFieldsArray(isDependencyTable ? filters : {})
							setAdd(true)
							hideAll()
						}}
					>
						Добавить{/*conf.addButtonTitle*/}
					</OutlineButton>
				</Row>
			}
		</>
	);
});

export default EditTable;