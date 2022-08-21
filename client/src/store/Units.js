import {makeAutoObservable} from "mobx";
import {ADMIN, API_ROUTES} from "../utils/consts";

export default class Units {
	constructor() {
		this._data = []
		this.endpoint = API_ROUTES.unit
		this.settings = ADMIN.unit

		makeAutoObservable(this)
	}

	setData(data) {
		this._data = data
	}

	get data() {
		return this._data
	}
}