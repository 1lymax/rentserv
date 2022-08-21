import {doFetch} from "./storeAPI";
import {API_ROUTES} from "../utils/consts";


export const fetchData = (context) => {
		doFetch(API_ROUTES.type).then(data => context.setTypes(data))

}

// export const createData = (context, endpoint, data) => {
//
// 	if (endpoint === API_ROUTES.type){
// 		doCreate(API_ROUTES.type, data).then()
// 	}
// 	if (endpoint === API_ROUTES.feature){
// 		doCreate(API_ROUTES.feature, data).then()
// 	}
// 	if (endpoint === API_ROUTES.unit){
// 		doCreate(API_ROUTES.unit, data).then()
// 	}
// 	if (endpoint === API_ROUTES.vehicle){
// 		doCreate(API_ROUTES.vehicle, data).then()
// 	}
//
// };

