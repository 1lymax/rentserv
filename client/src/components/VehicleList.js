import {Grid} from "semantic-ui-react";
import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";

import {Context} from "../index";
import VehicleItem from "./VehicleItem";

const VehicleList = observer(() => {
	const {vehicle} = useContext(Context)

	return (
		<Grid>
			{vehicle.data.map(vehicle =>
				<Grid.Column mobile={16} tablet={8} computer={5} key={vehicle.id}>
					<VehicleItem vehicle={vehicle}></VehicleItem>
				</Grid.Column>
			)}

		</Grid>
	);
});

export default VehicleList;