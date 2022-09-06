import React, {useEffect, useState} from 'react';
import ImageItem from "./ImageItem/ImageItem";
import {doCreate, doDelete, doFetch} from "../../http/storeAPI";
import {Grid} from "@mui/material";
import {ADMIN} from "../../utils/consts";

const ImageList = ({context, filters}) => {
		const [data, setData] = useState([])
		const [uploadedFile, setUploadedFile] = useState({file: '', imagePreviewUrl: ''})
		// const [file, setFile] = useState(null)
		const [needFetch, setNeedFetch] = useState(0)
		const dependsOn = ADMIN[context.endpoint].dependsOn

		useEffect(() => {
			doFetch(context, '', filters)
				.then(resp => setData(resp.results))
		}, [needFetch]);

		const handleImageUpload = (e) => {

			let reader = new FileReader();
			let file = e.target.files[0];

			reader.onloadend = () => {
				setUploadedFile({
					file: file,
					imagePreviewUrl: reader.result
				});
			}
			reader.readAsDataURL(file)

		};

		const handleAction = (action, id) => {
			if (action) {
				const formData = new FormData()
				formData.append([dependsOn], filters[dependsOn])
				formData.append('image', uploadedFile.file)
				doCreate(context, formData).then(() => setNeedFetch(Date.now()))
					.then(setUploadedFile({file: '', imagePreviewUrl: ''}));
			} else {
				if (uploadedFile.file) {
					setUploadedFile({file: '', imagePreviewUrl: ''});
				} else {
					doDelete(context, id).then(() => setNeedFetch(Date.now()))
				}
			}
		};

		return (
			<React.Fragment>
				<Grid container spacing={0} display={"flex"} direction={"row"} justifyContent={"start"}
					  justifyItems={"center"}>
					{data.map(image =>
						<Grid item lg={3} md={4} sm={5} className="mt-3" key={image.id}>
							<ImageItem image={image.image} id={image.id} handleAction={handleAction} isBackendImage={true}/>
						</Grid>
					)}
					<Grid item lg={3} md={4} sm={5} className="mt-3">
						{uploadedFile.imagePreviewUrl
							? <ImageItem image={uploadedFile.imagePreviewUrl} handleAction={handleAction}/>
							: <ImageItem newPlacement handleImageUpload={handleImageUpload} handleAction={handleAction}/>
						}
					</Grid>
				</Grid>
			</React.Fragment>
		);
	}
;

export default ImageList;