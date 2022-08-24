import React, {useContext, useEffect, useState} from 'react';
import {Container} from "react-bootstrap";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import DictAccordion from "../../components/UI/DictAccordion/DictAccordion";
import {doFetch} from "../../http/storeAPI";
import CreateVehicle from "../../components/modals/CreateVehicle";

const VehiclesAdmin = observer (() => {
	const [vehicleVisible, setVehicleVisible] = useState(false)
	const contextScope = useContext(Context)
	const user = contextScope.user

	useEffect(() => {
		for (const obj of Object.values(contextScope)) {
			obj.noFetchContextFromBackend === undefined && doFetch(obj, '', '')
				.then(data => obj.setData(data))
		}
	}, []);

	// useEffect(() => {
	// 	doFetch(vehicles)
	// }, [vehicles]);

	return (
		<Container className="d-flex flex-column">
			{user.isStaff
				?
				<>
					<h4 className="mt-3">Транспорт</h4>
					<DictAccordion
						context={contextScope['vehicles']}
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