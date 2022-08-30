import React, {useContext, useEffect, useState} from 'react';
import {Container} from "react-bootstrap";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import DictAccordion from "../../components/UI/DictAccordion/DictAccordion";
import CreateType from "../../components/modals/CreateType";
import {doFetch} from "../../http/storeAPI";
import CreateFeature from "../../components/modals/CreateFeature";
import CreateVehicle from "../../components/modals/CreateVehicle";
import {ADMIN} from "../../utils/consts";

const Catalogs = observer (() => {
	const [typeVisible, setTypeVisible] = useState(false)
	const [featureVisible, setFeatureVisible] = useState(false)
	const [featureVehicleVisible, setFeatureVehicleVisible] = useState(false)
	const [unitVisible, setUnitVisible] = useState(false)
	const [cityVisible, setCityVisible] = useState(false)
	const contextScope = useContext(Context)
	const user = contextScope.user

	useEffect(() => {
		for (const obj of Object.values(contextScope)) {
			obj.noFetchContextFromBackend === undefined && doFetch(obj)
				.then(data => obj.setData(data.results))
		}
	}, [contextScope]);

	const {cities, units, types, features, vehicleFeatures} = useContext(Context)

	// useEffect(() => {
	// 	doFetch(types)
	// }, [types]);
	//
	// useEffect(() => {
	// 	doFetch(features)
	// }, [features]);
	//
	// useEffect(() => {
	// 	doFetch(units)
	// }, [units]);
	//
	// useEffect(() => {
	// 	doFetch(cities)
	// }, [cities]);
	//
	// useEffect(() => {
	// 	doFetch(vehicleFeatures)
	// }, [vehicleFeatures]);



	return (
		<Container className="d-flex flex-column">
			{user.isStaff
				?
				<>
					<h4 className="mt-3">Транспорт</h4>
					<DictAccordion
						context={types}
						conf={ADMIN.type}
						modalVisible={typeVisible}
						setModalVisible={setTypeVisible}
						Create={CreateType}
					/>

					<DictAccordion
						context={features}
						conf={ADMIN.feature}
						modalVisible={featureVisible}
						setModalVisible={setFeatureVisible}
						Create={CreateFeature}
					/>

					<DictAccordion
						context={units}
						conf={ADMIN.unit}
						modalVisible={unitVisible}
						setModalVisible={setUnitVisible}
						Create={CreateVehicle}
					/>

					<DictAccordion
						context={vehicleFeatures}
						conf={ADMIN.vehicleFeatures}
						modalVisible={featureVehicleVisible}
						setModalVisible={setFeatureVehicleVisible}
						Create={CreateVehicle}
					/>

					<h4 className="mt-4">Склады</h4>

					<DictAccordion
						context={cities}
						conf={ADMIN.city}
						modalVisible={cityVisible}
						setModalVisible={setCityVisible}
						Create={CreateVehicle}
					/>


					{/*<DictAccordion*/}
					{/*	scope={vehicles.self}*/}
					{/*	context={vehicles}*/}
					{/*	title={'Транспорт'}*/}
					{/*	modalVisible={vehicleVisible}*/}
					{/*	setModalVisible={setVehicleVisible}*/}
					{/*	Create={CreateVehicle}*/}
					{/*	endpoint='vehicle'*/}
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