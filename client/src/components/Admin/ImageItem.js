import React from 'react';
import {Card, Col, Image} from "react-bootstrap";

const ImageItem = ({image}) => {
	return (
		<Col lg={3} md={4} sm={5} className="mt-3">
			{/*onClick={() => navigate(ITEMDETAIL_ROUTE + '/' + vehicle.id)}>*/}
			<Card style={{width: 180, cursor: "pointer"}} border={"light"}>
				<Image
					width={180}
					height={180}
					src={image.image
						? image.image
						: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"}
				/>
				{/*<div className="text-black-50 d-flex justify-content-between align-items-center mt-2">*/}
				{/*	<div>{vehicle.vehicle_type_name}</div>*/}
				{/*	<div>*/}
				{/*		<div>--</div>*/}
				{/*	</div>*/}
				{/*</div>*/}
				{/*<div>{vehicle.name}</div>*/}
			</Card>
		</Col>
	);
};

export default ImageItem;