import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import {doCreate, doDelete, doFetch, doUpdate} from "../../http/storeAPI";
import InputControl from "../UI/Admin/InputControl";
import {Context} from "../../index";
import setDependencyName from "../../utils/setDependencyName";
import classes from "./DictList.module.css"


const DictList = ({context, isDependency, filters, ordering}) => {
	const [inputVisible, setInputVisible] = useState(0)
	const [edit, setEdit] = useState(0)
	const [add, setAdd] = useState(false)
	const [fieldValues, setFieldValues] = useState({})
	const [isLoading, setIsLoading] = useState(false)
	const [dependencyArray, setDependencyArray] = useState([])
	const contextScope = useContext(Context)

	useEffect(() => {
		!isDependency &&
		doFetch(context, ordering, filters)
			.then(data => context.setData(data))
		console.log('context', context, filters)
	}, []);
	// const context = Object.assign(contextMain)

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
			return setDependencyName(contextScope[set.contextName].data, item[set.name]).name
		} else {
			return item[set.name]
		}
	};

	const setFieldsArray = (item) => {
		context.settings.fields.map(field => {
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
				doFetch(context).then(data => context.setData(data))
				hideAll()
			}).catch(e => {
				console.log(e.response.data)
			});
		} else if (inputVisible === 0) {
			doCreate(context, fieldValues).then(() => {
				doFetch(context).then(data => context.setData(data))
				setFieldsArray('')
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

	const fetchDependency = (id, field, context) => {
		const params = {}
		params[field] = id
		return doFetch(context, '', params)
			.then(data => {
					setDependencyArray(prevState => (
							[...prevState.filter(item => item.id !== id),

								{
									id: id,
									data: data,
								}]
						)
					)
				}
			)

	};

	return (
		<>
			{!isDependency &&
				<Row className={["pt-3 pb-3", classes.dict__title].join(' ')}>
					{context.settings.fields.map(sets =>
						<Col key={sets.name} className={["", sets.cssClassName].join(' ')}
						>
							{sets.placeholder}
						</Col>
					)}
					<Col className="col-1"></Col>
				</Row>
			}
			{context.data.map(item =>
				<Container key={item.id}>
					<Row className={["d-flex align-items-center", classes.dict__item].join(' ')}
						 onMouseEnter={() => setInputVisible(item.id)}
						 onMouseLeave={() => setInputVisible(0)}
					>
						{context.settings.fields.map(sets =>
							<Col key={sets.name}
								 className={["", sets.cssClassName].join(' ')}
							>
								{edit === item.id
									?
									<InputControl
										onChange={e => handleChange(e)}
										value={fieldValues[sets.name]}
										sets={sets}
										selectOptions={sets.contextName && contextScope[sets.contextName].data}
									/>
									:
									<div className="m-1 p-1"
										 onClick={() => {
											 setFieldsArray(item)
											 setAdd(false)
											 handleEditOrSave(item.id, sets)
										 }}>
										{setCellValue(item, sets)}
									</div>

								}
							</Col>
						)}

						{inputVisible === item.id
							?
							<Col className={"col-12 d-flex flex-row justify-content-end"} lg={2}>
								<Button
									variant={"outline-dark"}
									className="m-1 p-1"
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
									className="m-1 p-1"
									onClick={() => {
										setAdd(false)
										handleDelOrCancel(item.id)
									}}
								>
									{edit === item.id ? 'Отм' : 'Удал.'}
								</Button>
							</Col>
							:
							<Col className={"col-1"}></Col>

						}
					</Row>
					{context.settings.dependencies &&
						<Row>

							{context.settings.dependencies.map(dependency =>

								<DictList key={dependency.name}
										  isDependency={true}
										  context={contextScope[dependency.name]}
										  showTitle={false}
										  filters={JSON.parse(`{"${dependency.field}":${item.id}}`)}
								>
									{/*{fetchDependency(item.id, dependency.parent, contextScope[dependency.name])}*/}
									{/*{console.log(item.id, dependency.parent, dependency)}*/}
								</DictList>
							)

							}
						</Row>
					}
				</Container>
			)}
			{add
				?
				<Row className={["pt-2 pb-2 d-flex align-items-center"].join(' ')}>
					{context.settings.fields.map(sets =>
						<Col
							key={sets.name}
							className={["", sets.cssClassName].join(' ')}
						>
							<InputControl
								onChange={e => handleChange(e)}
								value={fieldValues[sets.name]}
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
				<Button
					variant={"outline-dark"}
					className="mt-1 p-1"
					style={{minWidth: "100px", width: "30%"}}
					onClick={() => {
						setIsLoading(true)
						setFieldsArray([])
						setAdd(true)
						hideAll()
					}}
				>
					Добавить
				</Button>
			}
		</>
	);
};

export default DictList;