import React, {useEffect, useState} from 'react';
import {Card, Segment} from "semantic-ui-react";

import {ADMIN} from "../../../utils/consts";
import ImageItem from "../ImageItem/ImageItem";
import {doCreate, doDelete, doFetch} from "../../../http/storeAPI";
import {convertErrorMessage} from "../../../utils/convertErrorMessage";
import {useSnackbar} from "notistack";

const ImageList = ({context, filters}) => {
		const [data, setData] = useState([])
		const {enqueueSnackbar} = useSnackbar()
		const [uploadedFile, setUploadedFile] = useState({file: '', imagePreviewUrl: ''})
		const [needFetch, setNeedFetch] = useState(0)
		const dependsOn = ADMIN[context.endpoint].dependsOn

		useEffect(() => {
			doFetch(context, '', filters)
				.then(resp => setData(resp.results))
				.catch(e => enqueueSnackbar(convertErrorMessage(e), {variant: "error"}));
			// eslint-disable-next-line
		}, [needFetch]);

		const handleImageUpload = (file) => {
			let reader = new FileReader();
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
			<Segment basic>
				<Card.Group>
					{data.map(image =>
						<ImageItem key={image.image} image={image.image} id={image.id} handleAction={handleAction}
								   isBackendImage={true}/>
					)}
					<>
						{uploadedFile.imagePreviewUrl
							? <ImageItem image={uploadedFile.imagePreviewUrl} handleAction={handleAction}/>
							: <ImageItem newPlacement handleImageUpload={handleImageUpload} handleAction={handleAction}/>
						}
					</>
				</Card.Group>
			</Segment>
		);
	}
;

export default ImageList;