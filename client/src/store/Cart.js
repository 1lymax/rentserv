import {makeAutoObservable} from "mobx";
import {API_ROUTES} from "../utils/consts";

export default class Cart {
	constructor() {
		this._data = {total: {price: 0, quantity: 0}}
		this._needFetch = 0
		this.endpoint = API_ROUTES.cart
		this.noFetchContextFromBackend = true

		makeAutoObservable(this)
	}

	setData(data) {
		this._data = data
	}

	get data() {
		return this._data
	}

	setNeedFetch(data) {
		this._needFetch = data
	}

	get needFetch() {
		return this._needFetch
	}
}