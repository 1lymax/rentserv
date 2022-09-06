import React, {useState} from 'react';
import AddIcon from "@mui/icons-material/Add";
import {grey} from "@mui/material/colors";
import {Box, Card, CardMedia, IconButton} from "@mui/material";
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import {useStyles} from "./styles";


const ImageItem = ({image, id, newPlacement, handleImageUpload, handleAction, isBackendImage}) => {
	const [buttonsVisible, setButtonsVisible] = useState(false)
	const styles = useStyles();

	return (
		<Card className={styles.card}
			  onMouseEnter={() => setButtonsVisible(true)}
			  onMouseLeave={() => setButtonsVisible(false)}
		>
			{newPlacement
				?
				<IconButton component={"label"}>
					<input hidden accept="image/*" type="file" onChange={e => handleImageUpload(e)}/>
					<AddIcon sx={{fontSize: 140, color: grey[300]}}/>
				</IconButton>
				:
				<Box>
					<CardMedia component="img"
							   className={styles.card}
							   image={image
								   ? image
								   : "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"}
					/>
					<Box className={styles.buttonBox} hidden={!buttonsVisible && isBackendImage}>
						{isBackendImage
							?
							<>
							<div></div>
							<IconButton onClick={() => handleAction(false, id)}>
								<DeleteIcon color='error'/>
							</IconButton>
							<div></div>
							</>
							:
							<>
							<IconButton onClick={() => handleAction(false, id)}>
								<DoDisturbIcon color='error'/>
							</IconButton>
							<IconButton onClick={() => handleAction(true, id)}>
							<CheckIcon color="success"/>
							</IconButton>
							</>
						}
					</Box>
				</Box>
			}
		</Card>

	)
		;
};

export default ImageItem;