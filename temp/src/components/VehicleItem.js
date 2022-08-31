import React from 'react';
import {Card, Col, Image} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {ITEMDETAIL_ROUTE} from "../utils/consts";

const VehicleItem = ({vehicle}) => {
	const {images} = vehicle
	const imagesObj = images.reduce((acc,curr)=> (acc[curr]=curr),{});
	const navigate = useNavigate()
	return (
		<Col md={3} className="mt-3" onClick={() => navigate(ITEMDETAIL_ROUTE + '/' + vehicle.id)}>
			<Card style={{width: 150, cursor: "pointer"}} border={"light"}>
				<Image
					width={150}
					height={150}
					src={imagesObj.image
						? imagesObj.image
						: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"}
				/>
				<div className="text-black-50 d-flex justify-content-between align-items-center mt-2">
					<div>{vehicle.vehicle_type_name}</div>
					<div>
						<div>--</div>
					</div>
				</div>
				<div>{vehicle.name}</div>
			</Card>
		</Col>
	);
};

export default VehicleItem;