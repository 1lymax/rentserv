import React, {useContext, useEffect, useState} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import SearchBar from "../components/SearchBar";
import VehicleList from "../components/VehicleList";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {doFetch} from "../http/storeAPI";
import MultiSelect from "../components/UI/MultiSelect/MultiSelect";

const Shop = observer(() => {
	const [selectedType, setSelectedType] = useState([])
	const [vehicleSorting, setVehicleSorting] = useState('')
	const filterParams = {vehicle_type: selectedType.id}
	const {vehicle, type} = useContext(Context)
	const sortingOptions = [
		{value: 'name', name: 'Название А-Я'},
		{value: '-name', name: 'Название Я-А'},
		{value: 'price_cap', name: 'Цена А-Я'},
		{value: '-price_cap', name: 'Цена Я-А'},
	]

	useEffect(() => {
		let ordering = {ordering: vehicleSorting}
		doFetch(vehicle, ordering, filterParams)
			.then(data => vehicle.setData(data.results))
	}, [vehicleSorting, filterParams]);

	useEffect(() => {
		doFetch(type)
			.then(data => type.setData(data.results))
	}, []);

	return (
		<Container fluid={"xl"}>
			<Row className="mt-3">
				<Col md={3}>
					<SearchBar onChange={setSelectedType}></SearchBar>
				</Col>
				<Col md={9}>
					<div style={{maxWidth: "180px"}}>
						<MultiSelect
							isMulti={false}
							isClearable={true}
							placeholder={'Сортировка'}
							options={sortingOptions}
							getOptionValue={(option) => `${option.value}`}
							getOptionLabel={(option) => `${option.name}`}
							value={vehicleSorting}
							onChange={e => e ? setVehicleSorting(e.value) : setVehicleSorting(undefined)}
						/>
					</div>
					<div>
						<VehicleList filterParams={filterParams}></VehicleList>
					</div>

				</Col>
			</Row>
		</Container>
	);
});

export default Shop;