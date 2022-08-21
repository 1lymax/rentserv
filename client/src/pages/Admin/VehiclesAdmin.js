import React, {useContext, useEffect, useState} from 'react';
import {Container} from "react-bootstrap";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import DictAccordion from "../../components/UI/DictAccordion/DictAccordion";
import {doFetch} from "../../http/storeAPI";
import CreateVehicle from "../../components/modals/CreateVehicle";

const VehiclesAdmin = observer (() => {
	const [vehicleVisible, setVehicleVisible] = useState(false)
	const {vehicles, user} = useContext(Context)

	useEffect(() => {
		doFetch(vehicles)
	}, [vehicles]);

	return (
		<Container className="d-flex flex-column">
			{user.isStaff
				?
				<>
					<h4 className="mt-3">Транспорт</h4>
					<DictAccordion
						context={vehicles}
						modalVisible={vehicleVisible}
						setModalVisible={setVehicleVisible}
						Create={CreateVehicle}
					/>
				</>
				:
				<div>
					Нет прав для просмотра
				</div>

			}

		</Container>
	);
});

export default VehiclesAdmin;