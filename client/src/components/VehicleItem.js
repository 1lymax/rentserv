import React, {useContext} from 'react';
import {Col, Image} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {ITEMDETAIL_ROUTE} from "../utils/consts";
import {Card} from "@mui/material";
import IButton from "./UI/IconButton/IButton";
import {AddShoppingCartOutlined} from "@mui/icons-material";
import {addToCart, doCreate} from "../http/storeAPI";
import {Context} from "../index";

const VehicleItem = ({vehicle}) => {
	const {images} = vehicle
	const imagesObj = images.reduce((acc,curr)=> (acc[curr]=curr),{});
	const navigate = useNavigate()
	const {cart} = useContext(Context)

	const handleClick = (e) => {
		e.stopPropagation()
	  	addToCart(vehicle.id, {id: vehicle.id, quantity: 1})
	}

	return (
		<Col lg={3} md={4} sm={5} className="mt-3" onClick={() => navigate(ITEMDETAIL_ROUTE + '/' + vehicle.id)}>
			<Card style={{width: 180, cursor: "pointer"}} border={"light"}>
				<Image
					width={180}
					height={180}
					src={imagesObj.image
						? imagesObj.image
						: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"}
				/>
				<div className="text-black-50 d-flex justify-content-between align-items-center mt-2">
					<div>{vehicle.vehicle_type_name}</div>
					<div>
						<div>
							<IButton onClick={e => handleClick(e)}>
								<AddShoppingCartOutlined/>
							</IButton>
						</div>
					</div>
				</div>
				<div>{vehicle.name}</div>
			</Card>
		</Col>
	);
};

export default VehicleItem;