import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import {doCreate, doDelete, doFetch, doUpdate} from "../../http/storeAPI";
import InputControl from "../UI/Admin/InputControl";
import {Context} from "../../index";
import setDependencyName from "../../utils/setDependencyName";
import classes from "./DictList.module.css"
import {ADMIN} from "../../utils/consts";
import {observer} from "mobx-react-lite";
import {makeAutoObservable} from "mobx";


const DictList = observer(({context, conf, isDependencyTable, filters, ordering}) => {
	const [inputVisible, setInputVisible] = useState(0)
	const [edit, setEdit] = useState(0)
	const [add, setAdd] = useState(false)
	const [fieldValues, setFieldValues] = useState({})
	const [isLoading, setIsLoading] = useState(false)
	const [data, setData] = useState([])
	const [needFetch, setNeedFetch] = useState([])
	const [focusElement, setFocusElement] = useState([])

	const contextScope = useContext(Context)

	useEffect(() => {
		doFetch(context, ordering, filters)
			.then(resp => setData(resp))
	}, [needFetch]);

	const handleChange = e => {
		let name = e.name || e.target.name
		let value = e.value || e.target.value
		setFieldValues(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	const setCellValue = (item, set) => {
		if (set.contextName && contextScope[set.contextName].data.length) {
			if (isNeedDependencyValue(set.name)) {
				return setDependencyName(contextScope[set.contextName].data, item[set.name]).name
			}
		} else {
			return item[set.name]
		}

	};

	const isNeedDependencyValue = (CellName) => {
		return !isDependencyTable || CellName !== context.settings.dependsOn
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
				setFieldsArray(isDependencyTable? filters: [])
				hideAll()
			})
		}
	}

	const handleDelOrCancel = (id) => {
		if (id === edit) {
			hideAll()
		} else {
			doDelete(context, id).then(() => {
				doFetch(context)
			})
		}
	}

	const hideAll = () => {
		setEdit(0)
		setInputVisible(0)
		setIsLoading(false)
	};
	return (
		<>
			{!isDependencyTable &&
				<Row className={["pt-3 pb-3", classes.dict__title].join(' ')}>
					{conf.fields.map(sets =>
						<Col key={sets.name} className={["", sets.cssClassName].join(' ')}
						>
							{sets.placeholder}
						</Col>
					)}
					<Col className="col-1"></Col>
				</Row>
			}
			{data.map(item =>
				<Container key={item.id} className={["",].join(' ')}>
					<Row
						className={["d-flex align-items-center", isDependencyTable && 'ms-4', classes.dict__item].join(' ')}
						onMouseEnter={() => setInputVisible(item.id)}
						onMouseLeave={() => setInputVisible(0)}
					>
						{conf.fields.map(sets =>
							<Col key={sets.name}
								 className={["", sets.cssClassName].join(' ')}
							>
								{edit === item.id
									?
									<InputControl
										onChange={e => handleChange(e)}
										hidden={isNeedDependencyValue(sets.name)}
										value={fieldValues[sets.name]}
										autoFocus={item.id === focusElement[0] && sets.name === focusElement[1]}
										sets={sets}
										selectOptions={sets.contextName && contextScope[sets.contextName].data}
									/>
									:
									<div className="m-1 p-1"
										 onClick={() => {
											 setFieldsArray(item)
											 setAdd(false)
											 setFocusElement([item.id, sets.name])
											 handleEditOrSave(item.id, sets)
										 }}>
										{setCellValue(item, sets)}
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
						<Row>

							{conf.dependencies.map(dep =>

								<DictList key={dep.name}
										  isDependencyTable={true}
										  context={contextScope[dep.name]}
										  conf={ADMIN[dep.name]}
										  showTitle={false}
										  filters={JSON.parse(`{"${dep.field}":${item.id}}`)}
								/>
							)
							}
						</Row>
					}
				</Container>
			)}
			{add
				?
				<Row className={["pt-2 pb-2 d-flex align-items-center", isDependencyTable && 'ms-4'].join(' ')}>
					{conf.fields.map(sets =>
						<Col
							key={sets.name}
							className={["", sets.cssClassName].join(' ')}
						>
							<InputControl
								onChange={e => handleChange(e)}
								value={fieldValues[sets.name]}
								add
								sets={sets}
								selectOptions={sets.contextName && contextScope[sets.contextName].data}
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
							setFieldsArray(isDependencyTable? filters : [])
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

export default DictList;