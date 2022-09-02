import React, {useContext, useEffect, useState} from 'react';
import {Container} from "react-bootstrap";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import DictAccordion from "../../components/UI/DictAccordion/DictAccordion";
import {doFetch} from "../../http/storeAPI";
import CreateVehicle from "../../components/modals/CreateVehicle";
import {ADMIN} from "../../utils/consts";
import Filter from "../../components/EditTable/Filter";

const VehiclesAdmin = observer (() => {
	const [vehicleVisible, setVehicleVisible] = useState(false)
	const contextScope = useContext(Context)
	const [filters, setFilters] = useState({})
	const user = contextScope.user
	useEffect(() => {
		for (const obj of Object.values(contextScope)) {
			obj.noFetchContextFromBackend === undefined && doFetch(obj, '', '')
				.then(data => obj.setData(data.results))
		}
	}, []);

	return (
		<Container className="d-flex flex-column">
			{user.isStaff
				?
				<>
					<h4 className="mt-3">Транспорт</h4>
					<Filter
						conf={ADMIN.vehicle}
						filterCallback={setFilters}
					/>
					<DictAccordion
						context={contextScope.vehicle}
						filters={filters}
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