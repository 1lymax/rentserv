import {useSnackbar} from "notistack";
import React, {useContext, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Card, Icon} from "semantic-ui-react";

import {Context} from "../index";
import {addToCart} from "../http/storeAPI";
import {ITEMDETAIL_ROUTE, MESSAGES} from "../utils/consts";
import {API_URL} from "../http";
import {convertErrorMessage} from "../utils/convertErrorMessage";

const VehicleItem = ({vehicle}) => {
	const {images} = vehicle
	const navigate = useNavigate()
	const {cart} = useContext(Context)
	const {enqueueSnackbar} = useSnackbar()
	const imagesObj = images.reduce((acc, curr) => (acc[curr] = curr), {});
	const [fetching, setFetching] = useState(false)

	const handleClick = (e) => {
		setFetching(true)
		setTimeout(
		addToCart(vehicle.id, {id: vehicle.id, quantity: 1})
			.then(resp => {
				cart.setData(resp)
				enqueueSnackbar(MESSAGES.cartAdd, {variant: "success"})
				setFetching(false)
			})
			.catch(e => enqueueSnackbar(convertErrorMessage(e), {variant: "error"}))
	,1000)

		e.stopPropagation()
	}

	return (
		<Card link
			  onClick={() => navigate(ITEMDETAIL_ROUTE + '/' + vehicle.id)}
			  header={vehicle.name}
			  meta={vehicle.vehicle_type_name}
			  extra={
				  <div style={{
					  display: "flex",
					  justifyContent: "space-between",
					  alignItems: "center",
					  fontSize: "1.4rem"
				  }}>
					  {vehicle.price_cap}
					  <Button primary onClick={e => handleClick(e)} loading={fetching}>
						  <Icon name="cart"/> Add
					  </Button>
				  </div>
			  }
			  image={{
				  src: imagesObj.image
					  ? imagesObj.image
					  : [API_URL, "/media/no_image.png"].join(" ").replace("/ /", "/")
			  }}
		/>
	);
};

export default VehicleItem;