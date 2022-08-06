import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from "./store/UserStore";
import Types from "./store/Types";
import Features from "./store/Features";
import MessureUnits from "./store/MessureUnits";
import Vehicles from "./store/Vehicles";
import VehicleFeatures from "./store/VehicleFeatures";

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<Context.Provider value={{
		user: new UserStore(),
		types: new Types(),
		features: new Features(),
		messureunits: new MessureUnits(),
		vehicles: new Vehicles(),
		vehiclefeatures: new VehicleFeatures()

	}}>
		<App/>
	</Context.Provider>
);

