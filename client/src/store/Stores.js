import {makeAutoObservable} from "mobx";
import {ADMIN, API_ROUTES} from "../utils/consts";

export default class Stores {
	constructor() {
		this._data = []
		this._aggregate = []
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

	setAggregate(data) {
		this._aggregate = data
	}

	get aggregate() {
		return this._aggregate
	}
}