import {makeAutoObservable} from "mobx";

export default class MessureUnits {
	constructor() {
		this._messureunits = [
			{id: 1, name: 'т.'},
			{id: 2, name: 'м.'},
			{id: 3, name: 'мм.'},

		]

		makeAutoObservable(this)
	}

	setTypes(messureunits) {
		this._messureunits = messureunits
	}

	get messureunits() {
		return this._messureunits
	}
}