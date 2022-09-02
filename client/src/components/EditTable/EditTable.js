import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import {doCreate, doDelete, doFetch, doUpdate} from "../../http/storeAPI";
import InputControl from "../UI/Admin/InputControl";
import {Context} from "../../index";
import setDependencyName from "../../utils/setDependencyName";
import classes from "./EditTable.module.css"
import {observer} from "mobx-react-lite";
import DependencyRowTable from "./DependencyRowTable";


const EditTable = observer(({context, isDependencyTable, filters, ordering, parentContext}) => {
	const [add, setAdd] = useState(false)
	const [edit, setEdit] = useState(0)
	const [data, setData] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [needFetch, setNeedFetch] = useState([])
	const [fieldValues, setFieldValues] = useState({})
	const [inputVisible, setInputVisible] = useState(0)
	const [focusElement, setFocusElement] = useState([])
	const [showDependency, setShowDependency] = useState({'': false})
	const [dependencyRenderArray, setDependencyRenderArray] = useState([])
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
				[field.name]: item[field.name] !== undefined ? item[field.name] : ''
			}));
		})
	};

	const handleEditOrSave = (id) => {
		setEdit(id)
		if (id === edit && id) {
			setIsLoading(true)
			doUpdate(context, id, fieldValues).then(() => {
				setNeedFetch(Date.now())
				hideAll()
			}).catch(e => {
				console.log(e.response.data)
			});
		} else if (inputVisible === 0) {
			doCreate(context, fieldValues).then(() => {
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

	const handleShowDependency = (dependency, item) => {
		setShowDependency(prevState => (
				{...prevState, [dependency.name + item.id]: !showDependency[dependency.name + item.id]}
			)
		)
		setDependencyRenderArray(prevState => (
			{
				...prevState,
				[dependency.name + item.id]:
					<EditTable
						isDependencyTable={true}
						parentContext={conf}
						context={contextScope[dependency.name]}
						showTitle={false}
						filters={{[dependency.field]: item.id}}
					/>

			}
		))
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
				<div className="d-flex justify-content-center">
					<h5>Нет данных</h5>
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
								<Col key={set.name}
									 className={["", set.cssClassName].join(' ')}
								>
									{edit === item.id
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
										<div className="m-1 p-1"
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
							)}

							{inputVisible === item.id
								?
								<Col className={"col-12 d-flex flex-row justify-content-end"} lg={2}
								>
									<Button
										variant={"outline-dark"}
										className="ms-1 p-1"
										onClick={() => {
											setFieldsArray(item)
											setAdd(false)
											handleEditOrSave(item.id, item.name)
										}}
									>
										{edit === item.id
											? isLoading
												?
												<>
													<Spinner
														as="span"
														animation="border"
														size="sm"
														role="status"
														aria-hidden="true"
													/> Сохр.
												</>
												: 'Сохр.'
											: 'Редакт.'
										}
									</Button>
									<Button
										variant={"outline-dark"}
										className="ms-1 p-1"
										onClick={() => {
											setAdd(false)
											handleDelOrCancel(item.id)
										}}
									>
										{edit === item.id ? 'Отм' : 'Удал.'}
									</Button>
								</Col>
								:
								<Col className={"col-1"}
								></Col>
							}
						</Row>
						{conf.dependencies &&
							<>
								{conf.dependencies.map(dep =>
										<Row key={dep.name}
											 className={["ms-4 me-4 flex-shrink-1", showDependency[dep.name + item.id] ? classes.dict__item : ''].join(' ')}
										>
											<Col style={{cursor: 'pointer'}}
												 onClick={() => handleShowDependency(dep, item)}
											>
												{dep.inlineTitle} {!showDependency[dep.name + item.id] ? '>>' : '<<'}
											</Col>
											<Col className="col-12" hidden={!showDependency[dep.name + item.id]}>
												{dependencyRenderArray[dep.name + item.id]}
											</Col>
										</Row>

									// <DependencyRowTable
									// key={dep.name}
									// contextScope={contextScope}
									// dependency={dep}
									// item={item}
									// showDependency={showDependency}
									// handleShowDependency={handleShowDependency}
									// conf={conf}
									// />
								)
								}
							</>
						}
					</Row>
				</Container>
			)}
			{add
				?
				<Row className={["pt-2 pb-2 d-flex align-items-center", isDependencyTable ? 'ms-4' : 'mb-4'].join(' ')}>
					{conf.fields.map(set =>
						<Col
							key={set.name}
							className={["", set.cssClassName].join(' ')}
						>
							<InputControl
								inputName={set.name}
								onChange={e => handleInputChange(e)}
								value={fieldValues[set.name]}
								add
								set={set}
								selectOptions={set.contextName && contextScope[set.contextName].data}
							/>
						</Col>
					)}


					<Col className={"col-12 d-flex flex-row justify-content-end"} lg={2}>
						<Button
							variant={"outline-dark"}
							className="m-1 p-1"
							onClick={() => {
								setEdit(-1)
								handleEditOrSave(undefined, fieldValues)
							}}
						>
							{isLoading
								?
								<>
									<Spinner
										as="span"
										animation="border"
										size="sm"
										role="status"
										aria-hidden="true"
									/> Сохраняю
								</>
								: 'Доб.'

							}
						</Button>
						<Button
							variant={"outline-dark"}
							className="m-1 p-1"
							onClick={() => setAdd(false)}
						>
							Отм.
						</Button>
					</Col>

				</Row>
				:
				<Row className={["mb-1", isDependencyTable && 'ms-4'].join(' ')}>
					<Button
						variant={"outline-dark"}
						className="mt-1 p-1"
						style={{minWidth: "50px", width: "20%"}}
						onClick={() => {
							setIsLoading(true)
							setFieldsArray(isDependencyTable ? filters : [])
							setAdd(true)
							hideAll()
						}}
					>
						{conf.addButtonTitle}
					</Button>
				</Row>
			}
		</>
	);
});

export default EditTable;