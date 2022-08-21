import {makeAutoObservable} from "mobx";
import {ADMIN, API_ROUTES} from "../utils/consts";

export default class Cities {
	constructor() {
		this._data = []
		this.endpoint = API_ROUTES.city
		this.title = ADMIN.city.title

		makeAutoObservable(this)
	}

	setData(data) {
		this._data = data
	}

	get data() {
		return this._data
	}
}