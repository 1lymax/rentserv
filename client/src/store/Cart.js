import {makeAutoObservable} from "mobx";
import {API_ROUTES} from "../utils/consts";

export default class Cart {
	constructor() {
		this._data = []
		this.endpoint = API_ROUTES.cart
		//this.settings = ADMIN.city

		makeAutoObservable(this)
	}

	setData(data) {
		this._data = data
	}

	get data() {
		return this._data
	}
}