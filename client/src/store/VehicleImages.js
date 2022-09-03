import {makeAutoObservable} from "mobx";
import {ADMIN, API_ROUTES} from "../utils/consts";

export default class VehicleImages {
	constructor() {
		this._data = []
		this.endpoint = API_ROUTES.vehicleImage
		this.settings = ADMIN.vehicleImage
		this.noFetchContextFromBackend = true

		makeAutoObservable(this)
	}

	setData(data) {
		this._data = data
	}

	get data() {
		return this._data
	}
}