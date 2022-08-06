import {makeAutoObservable} from "mobx";

export default class Vehicles{
	constructor() {
		this._vehicles = [
			{id: 1, name: 'Hyundai H-200', vehicle_type: 1, price_cap: 700, price_region: 650},
			{id: 2, name: 'Hyundai H-78', vehicle_type: 1, price_cap: 900, price_region: 800},
			{id: 3, name: 'Камаз 6538', vehicle_type: 2, price_cap: 900, price_region: 800},

		]

		makeAutoObservable(this)
	}

	setTypes(vehicles) {
		this._vehicles = vehicles
	}

	get vehicles() {
		return this._vehicles
	}
}