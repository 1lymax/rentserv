import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Row} from "react-bootstrap";
import VehicleItem from "./VehicleItem";

const VehicleList = observer(({filterParams}) => {
	const {vehicles} = useContext(Context)
	let vehiclesFiltered = [...vehicles.data]
	if (filterParams.vehicle_type) {
		vehiclesFiltered = vehiclesFiltered.filter(vehicle => {
			return vehicle.vehicle_type === filterParams.vehicle_type
		})
	}
	return (
		<Row className="d-flex">
			{vehiclesFiltered.map(vehicle =>
				<VehicleItem key={vehicle.id} vehicle={vehicle}></VehicleItem>
			)}
		</Row>
	);
});

export default VehicleList;