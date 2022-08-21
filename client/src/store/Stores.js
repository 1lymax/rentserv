import {makeAutoObservable} from "mobx";
import {ADMIN, API_ROUTES} from "../utils/consts";

export default class Stores {
	constructor() {
		this._data = []
		this.endpoint = API_ROUTES.store
		this.settings = ADMIN.store

		makeAutoObservable(this)
	}

	setData(data) {
		this._data = data
	}

	get data() {
		return this._data
	}
}