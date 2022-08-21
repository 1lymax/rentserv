import {makeAutoObservable} from "mobx";
import {ADMIN, API_ROUTES} from "../utils/consts";

export default class Features {
	constructor() {
		this._data = []
		this.endpoint = API_ROUTES.feature
		this.settings = ADMIN.feature

		makeAutoObservable(this)
	}

	setData(data) {
		this._data = data
	}

	get data() {
		return this._data
	}
}