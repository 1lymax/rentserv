import React, {useState} from 'react';
import {Button, Form, Spinner} from "react-bootstrap";
import {doCreate, doDelete, doFetch, doUpdate} from "../http/storeAPI";

const DictList = ({context}) => {
	const [inputVisible, setInputVisible] = useState(0)
	const [edit, setEdit] = useState(0)
	const [add, setAdd] = useState(false)
	const [fieldValue, setFieldValue] = useState('')
	const [isLoading, setIsLoading] = useState('')

	const editOrSave = (id, itemName) => {
		setEdit(id)
		setFieldValue(itemName)
		if (id === edit) {
			setIsLoading(true)
			doUpdate(context, id, fieldValue).then(() => {
				doFetch(context)
				hideAll()
			}).catch(e => {
				console.log(e.response.data)
			});
		} else if (inputVisible === 0) {
			doCreate(context, {name: fieldValue}).then(() => {
				doFetch(context)
				setFieldValue('')
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
			{context.data.map(item =>
				<div key={item.id}
					 className="d-flex justify-content-between align-items-center dict__item"
					 onMouseEnter={() => setInputVisible(item.id)}
					 onMouseLeave={() => setInputVisible(0)}
				>
					<div style={{width: "auto"}}>
						{edit === item.id
							?
							<Form>
									<Form.Control
										onChange={e => setFieldValue(e.target.value)}
										value={item.name}
										placeholder={"Название"}
										autoFocus={true}
									/>
							</Form>
							:
							<div className="m-2 p-1"
								 onClick={() => {
									 setAdd(false)
									 editOrSave(item.id, item.name)
								 }}>
								{item.name}
							</div>

						}
					</div>

					{inputVisible === item.id
						?
						<div>
							<Button
								variant={"outline-dark"}
								className="p-1"
								onClick={() => {
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
					<div style={{width: "70%"}}>
						<Form>
							<Form.Control
								onChange={e => setFieldValue(e.target.value)}
								value={fieldValue}
								placeholder={"Название"}
								autoFocus={true}
							/>
						</Form>
					</div>
					<div>
						<Button
							variant={"outline-dark"}
							className="m-1 p-1"
							onClick={() => {
								setEdit(-1)
								editOrSave(undefined, fieldValue)
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
						setFieldValue('')
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