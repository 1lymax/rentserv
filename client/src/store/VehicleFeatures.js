import {makeAutoObservable} from "mobx";

export default class VehicleFeatures{
	constructor() {
		this._vehiclefeatures = [
			{id: 1, name: 'Грузоподъемность стрелы'},
			{id: 2, name: 'Грузоподъемность борта'}
		]

		makeAutoObservable(this)
	}

	setTypes(vehiclefeatures) {
		this._vehiclefeatures = vehiclefeatures
	}

	get vehiclefeatures() {
		return this._vehiclefeatures
	}
}