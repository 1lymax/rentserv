import {makeAutoObservable} from "mobx";
import {ADMIN, API_ROUTES} from "../utils/consts";

export default class Vehicles {
	constructor() {
		this._data = []
		this.endpoint = API_ROUTES.vehicle
		this.title = ADMIN.vehicle.title

		makeAutoObservable(this)
	}

	setData(data) {
		this._data = data
	}

	get data() {
		return this._data
	}
}