import {makeAutoObservable} from "mobx";
import {ADMIN, API_ROUTES} from "../utils/consts";

export default class VehicleFeatures {
	constructor() {
		this._data = []
		this.endpoint = API_ROUTES.vehicleFeature
		this.settings = ADMIN.vehicleFeature

		makeAutoObservable(this)
	}

	setData(data) {
		this._data = data
	}

	get data() {
		return this._data
	}
}