import React, {useEffect, useState} from 'react';
import {Row} from "react-bootstrap";
import ImageItem from "./ImageItem";
import {doFetch} from "../../http/storeAPI";
import {ADMIN} from "../../utils/consts";

const ImageList = ({context, filters}) => {
	const [data, setData] = useState([{id: 0, image: ADMIN.newImage}])
	// const [file, setFile] = useState(null)
	// const [needFetch, setNeedFetch] = useState(0)

	useEffect(() => {
		doFetch(context, '', filters)
			.then(resp => setData(resp.results))
		//addNewImagePlacement()
	}, []);

	// const selectFile = e => {
	// 	setFile(e.target.files[0])
	// };

	// const addNewImagePlacement = () => {
	// 	setData(prevState => ([
	// 				...prevState,
	// 				// console.log('prevState findIndex', !prevState.findIndex(i => i.id === 0)),
	// 				!prevState.findIndex(i => i.id === 0)
	// 				&& {id: 0, image: ADMIN.newImage},
	// 			]
	// 		)
	// 	)
	// }

	return (
		<>
			<Row className="d-flex flex-row justify-content-start">
				{data.map(image =>
					<ImageItem key={image.id} image={image}/>
				)}
			</Row>
			{/*<Row>*/}
			{/*	<input accept="image/*" type="file" id="select-image" style={{display: "none"}}/>*/}
			{/*	<label htmlFor="select-image">*/}
			{/*		<Button variant="contained" color="primary">*/}
			{/*			Upload Image*/}
			{/*		</Button>*/}
			{/*	</label>*/}
			{/*</Row>*/}
		</>
	);
};

export default ImageList;