import React, {useContext} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Card, Icon} from "semantic-ui-react";

import {Context} from "../index";
import {addToCart} from "../http/storeAPI";
import {ITEMDETAIL_ROUTE} from "../utils/consts";

const VehicleItem = ({vehicle}) => {
	const {images} = vehicle
	const {cart} = useContext(Context)
	const imagesObj = images.reduce((acc, curr) => (acc[curr] = curr), {});
	const navigate = useNavigate()

	const handleClick = (e) => {
		addToCart(vehicle.id, {id: vehicle.id, quantity: 1})
			.then(resp => cart.setData(resp))
		e.stopPropagation()
	}

	return (
		<Card link
			  onClick={() => navigate(ITEMDETAIL_ROUTE + '/' + vehicle.id)}
			  header={vehicle.name}
			  meta={vehicle.vehicle_type_name}
			  extra={
				  <div style={{display:"flex", justifyContent: "space-between", alignItems:"center", fontSize:"1.4rem"}}>
					 {vehicle.price_cap}
				  <Button primary onClick={e => handleClick(e)}>
					  <Icon name="cart"/> Add
				  </Button>
				  </div>
			  }
			  image={{
				  src: imagesObj.image
					  ? imagesObj.image
					  : "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
			  }}
		/>
	);
};

export default VehicleItem;