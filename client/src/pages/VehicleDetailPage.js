import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Container, Image, Row} from "react-bootstrap";
import {Context} from "../index";
import setDependencyNames from "../utils/setDependencyNames";
import {fetchOneVehicle} from "../http/storeAPI";
import {useParams} from "react-router-dom";


const VehicleDetailPage = () => {
	const [vehicle, setVehicle] = useState({images: [{image: ''}], features:[]})
	const {id} = useParams()
	const {features} = useContext(Context)
	const {images} = vehicle;
	const vehicleFeature = vehicle.features;
	useEffect(() => {
		fetchOneVehicle(id).then(data => setVehicle(data))
	}, [id]);

	return (
		<Container className="mt-3">
			<Row>
				<Col md={4}>
					{images.length
						?
						<Image width={300} height={300} src={images[0].image}/>
						:
						<></>
					}

				</Col>
				<Col md={4}>
					<Row>
						<h2>{vehicle.name}</h2>
						<div>{vehicle.vehicle_type_name}</div>
					</Row>
				</Col>
				<Col md={4}>
					<div className="p-2 d-flex flex-column">
						<div className="d-flex flex-row justify-content-between align-items-center">
							<div>
								<h6>Цена</h6>
								<h6>за смену</h6>
							</div>
							<div>
								<h2>{vehicle.price_region}</h2>

							</div>
						</div>
						<Button variant={"outline-dark"}>Добавить в корзину</Button>
					</div>

				</Col>
			</Row>
			{vehicleFeature.length
				?
				<Row className="d-flex flex-column m-3">
					{vehicleFeature.map((item, index) =>
						<Row
							key={item.id}
							style={{background: index % 2 === 0? 'lightgray' : 'transparent'}}
						>
							{setDependencyNames(features.descr, item.id).name}: {item.value} {setDependencyNames(features.units, item.unit).name}
						</Row>
					)}
				</Row>
				:
				<></>

			}


		</Container>
	);
};

export default VehicleDetailPage;