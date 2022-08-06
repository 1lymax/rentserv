import {makeAutoObservable} from "mobx";
import {type} from "@testing-library/user-event/dist/type";

export default class Types{
	constructor() {
		this._types = [
			{id: 1, name: 'Манипулятор'},
			{id: 2, name: 'Самосвал'},
			{id: 3, name: 'Экскаватор'},
			{id: 4, name: 'Бульдозер'},
		]
		this._selectedType = {}

		makeAutoObservable(this)
	}

	setTypes(types) {
		this._types = types
	}

	setSelectedType(type) {
		this._selectedType = type
	}
	get types() {
		return this._types
	}

	get selectedType() {
		return this._selectedType
	}

}