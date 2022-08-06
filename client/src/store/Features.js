import {makeAutoObservable} from "mobx";

export default class Features{
	constructor() {
		this._features = [
			{id: 1, name: 'Грузоподъемность стрелы'},
			{id: 2, name: 'Грузоподъемность борта'}
		]

		makeAutoObservable(this)
	}

	setTypes(features) {
		this._features = features
	}

	get features() {
		return this._features
	}
}