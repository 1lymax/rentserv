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


export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<Context.Provider value={{
		user: new UserStore(),
		features: new Features(),
		vehicles: new Vehicles(),
		stores: new Stores(),
		cities: new Cities(),
		types: new Types(),
		units: new Units(),
		vehicleFeatures: new VehicleFeatures()
	}}>
		<App/>
	</Context.Provider>
);

