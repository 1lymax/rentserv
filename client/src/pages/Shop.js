import React, {useContext, useEffect, useState} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import SearchBar from "../components/SearchBar";
import VehicleList from "../components/VehicleList";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import MySelect from "../components/UI/MySelect";
import {doFetch} from "../http/storeAPI";

const Shop = observer(() => {
    const [selectedType, setSelectedType] = useState([])
    const filterParams = {vehicle_type: selectedType.id}
    const [vehicleSorting, setVehicleSorting] = useState('')
    const {vehicles, types,} = useContext(Context)
    const ordering = []


    useEffect(() => {
        ordering['vehicle'] = vehicleSorting
        doFetch(vehicles, ordering)
    }, [vehicleSorting]);

    useEffect(() => {
        doFetch(types)
    }, [types]);

    return (
        <Container>
            <Row className="mt-3">
                <Col md={3}>
                    <SearchBar onChange={setSelectedType}></SearchBar>
                </Col>
                <Col md={9}>
                    <MySelect
                        options={[
                            {value: 'name', name: 'Название А-Я'},
                            {value: '-name', name: 'Название Я-А'},
                            {value: 'price_cap', name: 'Цена А-Я'},
                            {value: '-price_cap', name: 'Цена Я-А'},
                        ]}
                        onChange={setVehicleSorting}
                    />
                    <VehicleList filterParams={filterParams}></VehicleList>

                </Col>
            </Row>
        </Container>
    );
});

export default Shop;