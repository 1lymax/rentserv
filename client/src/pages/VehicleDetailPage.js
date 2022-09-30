import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {addToCart, doFetch, fetchOneVehicle} from "../http/storeAPI";
import {useParams} from "react-router-dom";
import {Button, Container, Grid, Icon, Image, Segment, Table} from "semantic-ui-react";
import {ADMIN} from "../utils/consts";


const VehicleDetailPage = () => {
	const [vehicle, setVehicle] = useState({images: [{image: ''}], features: []})

	const {id} = useParams()
	const {feature, unit, cart} = useContext(Context)
	const {images} = vehicle;
	const vehicleFeature = vehicle.features

	useEffect(() => {
		fetchOneVehicle(id).then(data => setVehicle(data))
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		doFetch(feature).then(data => feature.setData(data.results))
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		doFetch(unit).then(data => unit.setData(data.results))
		// eslint-disable-next-line
	}, []);

	const handleClick = (e) => {
		addToCart(vehicle.id, {id: vehicle.id, quantity: 1})
			.then(resp => cart.setData(resp))
		e.stopPropagation()
	}

	return (
		<Container className="mt-3">
			<Grid columns={3}>
				<Grid.Column>
					{images.length
						?
						<Image width={300} height={300} src={images[0].image}/>
						:
						<></>
					}

				</Grid.Column>
				<Grid.Column>
					<Segment basic>
						<h2>{vehicle?.name}</h2>
						<div>{vehicle?.vehicle_type_name}</div>
					</Segment>
				</Grid.Column>
				<Grid.Column textAlign={"right"}>
					<Segment basic>
						<div style={{marginBottom: '15px'}}>
							Цена за смену
						</div>
						<Grid columns={2}>
							<Grid.Row>
								<Grid.Column>Столица</Grid.Column>
								<Grid.Column><h2>{vehicle?.price_cap}</h2></Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column>Регионы</Grid.Column>
								<Grid.Column><h2>{vehicle?.price_region}</h2></Grid.Column>
							</Grid.Row>
						</Grid>
						<div style={{marginTop: '15px'}} >
							<Button primary onClick={(e) => handleClick(e)}>
								<Icon name="cart"></Icon>
								Add to Cart
							</Button>
						</div>
					</Segment>
				</Grid.Column>
			</Grid>
			{vehicleFeature.length
				?
				<Table striped>
					<Table.Header>
						<Table.Row>
							{ADMIN.vehicleFeature.fields.map(item => item.name !== 'vehicle' &&
								<Table.HeaderCell key={item.name}>
									{item.placeholder}
								</Table.HeaderCell>
							)
							}
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{vehicleFeature.map((item) =>
							<Table.Row key={item.id}>
								<Table.Cell>
									{feature.data.filter(i => i.id === item.feature)[0].name}
								</Table.Cell>
								<Table.Cell>
									{item.value}
								</Table.Cell>
								<Table.Cell>
									{unit.data.filter(i => i.id === item.unit)[0].name}
								</Table.Cell>

							</Table.Row>
						)}
					</Table.Body>
				</Table>
				:
				<></>

			}


		</Container>
	);
};

export default VehicleDetailPage;