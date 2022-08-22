import React, {useContext, useState} from 'react';
import {Button, Col, Row, Spinner} from "react-bootstrap";
import {doCreate, doDelete, doFetch, doUpdate} from "../../http/storeAPI";
import InputControl from "../UI/Admin/InputControl";
import {Context} from "../../index";
import setDependencyName from "../../utils/setDependencyName";
import classes from "./DictList.module.css"

const DictList = ({context}) => {
	const [inputVisible, setInputVisible] = useState(0)
	const [edit, setEdit] = useState(0)
	const [add, setAdd] = useState(false)
	const [fieldValues, setFieldValues] = useState({})
	const [isLoading, setIsLoading] = useState('')
	const contextScope = useContext(Context)

	const handleChange = e => {
		let name = e.name || e.target.name
		let value = e.value || e.target.value
		setFieldValues(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	const setCellValue = (item, set) => {
		if (set.contextName) {
			return setDependencyName(contextScope[set.contextName].data, item[set.name]).name
		}else{
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

	const editOrSave = (id) => {
		setEdit(id)
		if (id === edit && id) {
			setIsLoading(true)
			console.log('fieldValues', fieldValues)
			doUpdate(context, id, fieldValues).then(() => {
				doFetch(context)
				hideAll()
			}).catch(e => {
				console.log(e.response.data)
			});
		} else if (inputVisible === 0) {
			doCreate(context, fieldValues).then(() => {
				doFetch(context)
				setFieldsArray('')
				hideAll()
			})

		}
	}
	const deleteOrCancel = (id) => {
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
			<Row className={["pt-3 pb-3", classes.dict__title].join(' ')}>
			{context.settings.fields.map(sets =>
				<Col key={sets.name} className={["ms-2", sets.cssClassName].join(' ')}
				>
					{sets.placeholder}
				</Col>

			)}
				<Col className="col-2"></Col>
			</Row>
			{context.data.map(item =>
				<div key={item.id}
					 className={["d-flex justify-content-between align-items-center", classes.dict__item].join(' ')}
					 onMouseEnter={() => setInputVisible(item.id)}
					 onMouseLeave={() => setInputVisible(0)}
				>
					<div style={{width: "auto"}} className="d-flex flex-row align-items-center">


						{context.settings.fields.map(sets =>
							<div key={sets.name} className="ms-1"
								 style={{width: sets.width || "auto"}}
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
									<div className="m-2 p-1"
										 style={{width: sets.width || "auto"}}
										 onClick={() => {
											 setFieldsArray(item)
											 setAdd(false)
											 editOrSave(item.id, sets)
										 }}>
										{setCellValue(item, sets)}
									</div>

								}
							</div>
						)}

					</div>

					{inputVisible === item.id
						?
						<div>
							<Button
								variant={"outline-dark"}
								className="p-1"
								onClick={() => {
									setFieldsArray(item)
									setAdd(false)
									editOrSave(item.id, item.name)
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
								className="p-1"
								onClick={() => {
									setAdd(false)
									deleteOrCancel(item.id)
								}}
							>
								{edit === item.id ? 'Отмена' : 'Удалить'}
							</Button>
						</div>
						:
						<div></div>

					}
				</div>
			)}
			{add
				?
				<div
					className="d-flex justify-content-between align-content-center">
					<div style={{width: "auto"}} className="d-flex flex-row align-items-center">
						{context.settings.fields.map(sets =>
							<div style={{width: sets.width || "auto"}}
								 className="ms-1"
								 key={sets.name}
							>
								<InputControl
									onChange={e => handleChange(e)}
									value={fieldValues[sets.name]}
									sets={sets}
									selectOptions={sets.contextName && contextScope[sets.contextName].data}
								/>
							</div>
						)}


					</div>
					<div>
						<Button
							variant={"outline-dark"}
							className="m-1 p-1"
							onClick={() => {
								setEdit(-1)
								editOrSave(undefined, fieldValues)
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
								: 'Добавить'

							}
						</Button>
						<Button
							variant={"outline-dark"}
							className="m-1 p-1"
							onClick={() => setAdd(false)}
						>
							Отмена
						</Button>
					</div>

				</div>
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