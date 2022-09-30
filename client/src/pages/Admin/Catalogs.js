import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";

import {Context} from "../../index";
import DictAccordion from "../../components/UI/DictAccordion/DictAccordion";
import {doFetch} from "../../http/storeAPI";
import {Container} from "semantic-ui-react";

const Catalogs = observer(() => {
	const [typeVisible, setTypeVisible] = useState(false)
	const [featureVisible, setFeatureVisible] = useState(false)
	const [featureVehicleVisible, setFeatureVehicleVisible] = useState(false)
	const [unitVisible, setUnitVisible] = useState(false)
	const contextScope = useContext(Context)
	const user = contextScope.user

	useEffect(() => {
		for (const obj of Object.values(contextScope)) {
			obj.noFetchContextFromBackend === undefined && doFetch(obj)
				.then(data => obj.setData(data.results))
		}
	}, [contextScope]);

	return (
		<Container>
			{user.isStaff
				?
				<>
					<h4 className="mt-3">Транспорт</h4>
					<DictAccordion
						context={contextScope.type}
						modalVisible={typeVisible}
						setModalVisible={setTypeVisible}
					/>

					<DictAccordion
						context={contextScope.feature}
						modalVisible={featureVisible}
						setModalVisible={setFeatureVisible}
					/>

					<DictAccordion
						context={contextScope.unit}
						modalVisible={unitVisible}
						setModalVisible={setUnitVisible}
					/>

					<DictAccordion
						context={contextScope.vehicleFeature}
						modalVisible={featureVehicleVisible}
						setModalVisible={setFeatureVehicleVisible}
					/>

					{/*<h4 className="mt-4">Склады</h4>*/}

					{/*<DictAccordion*/}
					{/*	context={cities}*/}
					{/*	conf={ADMIN.city}*/}
					{/*	modalVisible={cityVisible}*/}
					{/*	setModalVisible={setCityVisible}*/}
					{/*	Create={CreateVehicle}*/}
					{/*/>*/}
				</>
				:
				<div>
					Нет прав для просмотра
				</div>

			}

		</Container>
	);
});

export default Catalogs;