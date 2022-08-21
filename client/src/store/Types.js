import {makeAutoObservable} from "mobx";
import {ADMIN, API_ROUTES} from "../utils/consts";

export default class Types {
	constructor() {
		this._data = []
		this.endpoint = API_ROUTES.type
		this.title = ADMIN.type.title

		makeAutoObservable(this)
	}

	setData(data) {
		this._data = data
	}

	get data() {
		return this._data
	}
}