import {makeAutoObservable} from "mobx";
import {ADMIN, API_ROUTES} from "../utils/consts";

export default class Orders {
	constructor() {
		this._data = []
		this.endpoint = API_ROUTES.order
		this.settings = ADMIN.order
		this.auth = true

		makeAutoObservable(this)
	}

	setData(data) {
		this._data = data
	}

	get data() {
		return this._data
	}
}