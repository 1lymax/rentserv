import React, {useState} from 'react';
import {FileUploader} from "react-drag-drop-files";
import {Button, Card, Icon, Image} from "semantic-ui-react";

import classes from "./ImageItem.module.css";


const ImageItem = ({image, id, newPlacement, handleImageUpload, handleAction, isBackendImage}) => {
	const [buttonsVisible, setButtonsVisible] = useState(false)
	const fileTypes = ["JPG", "PNG", "GIF"];

	const handleChange = (file) => {
		handleImageUpload(file);
	};

	return (
		<Card className={classes.cardImageList}
			onMouseEnter={() => setButtonsVisible(true)}
			onMouseLeave={() => setButtonsVisible(false)}
		>
			{newPlacement
				?
				<FileUploader handleChange={e => handleChange(e)}
							  name="file" types={fileTypes}
							  className={classes.drop_module}
							  children={
								  <div className={classes.drop_area}>
									  <Icon.Group size="huge" color="blue">
										  <Icon name="photo" color="blue"/>
										  <Icon corner="bottom right" name="add" color="blue"/>
									  </Icon.Group>
									  <div>{fileTypes.join(', ')}</div>
								  </div>}
				/>
				:
				<>
					<Image src={image
						? image
						: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"}
					/>
					<div className={classes.buttonBox} hidden={!buttonsVisible && isBackendImage}>
						{isBackendImage
							?
							<>
								<div></div>
								<Button className={classes.button}>
									<Icon name="trash" color="red" onClick={() => handleAction(false, id)}/>
								</Button>
								<div></div>
							</>
							:
							<>
								<Button className={classes.button}>
									<Icon name="trash" color="red" onClick={() => handleAction(false, id)}/>
								</Button>
								<Button className={classes.button}>
									<Icon name="check" color="green" onClick={() => handleAction(true, id)}/>
								</Button>
							</>
						}
					</div>
				</>
			}
		</Card>

	)
		;
};

export default ImageItem;