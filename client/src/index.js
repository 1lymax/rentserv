import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from "./store/UserStore";
import Features from "./store/Features";
import Vehicles from "./store/Vehicles";
import Stores from "./store/Stores";
import Cities from "./store/Cities";
import Types from "./store/Types";
import Units from "./store/Units";
import VehicleFeatures from "./store/VehicleFeatures";
import VehicleImages from "./store/VehicleImages";
import Cart from "./store/Cart";
import {SnackbarProvider} from "notistack";


export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<SnackbarProvider
		preventDuplicate={true}
	>
		<Context.Provider value={{
			user: new UserStore(),
			feature: new Features(),
			vehicle: new Vehicles(),
			store: new Stores(),
			city: new Cities(),
			type: new Types(),
			unit: new Units(),
			cart: new Cart(),
			vehicleImage: new VehicleImages(),
			vehicleFeature: new VehicleFeatures()
		}}>
			<App/>
		</Context.Provider>
	</SnackbarProvider>
);

