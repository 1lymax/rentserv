import {makeStyles} from "@mui/styles";
import {ADMIN} from "../../../utils/consts";

const width = ADMIN.imageCardWidth
const height = ADMIN.imageCardHeight

export const useStyles = makeStyles(() => ({

	card: {
		position: 'relative',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: width,
		height: height,
		minHeight: height,
		'&:hover': {
			content: '""',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			//height: '100%',
			height: height * 0.64,
			bottom: 0,
			zIndex: 1,
			background: 'white'
			//background: 'linear-gradient(to top, #fff, rgba(0,0,0, 0))',
		},
	},
	buttonBox: {
		position: 'absolute',
		zIndex: 2,
		bottom: 0,
		width: width,
		height: 40,
		//marginLeft: '1px',
		//marginRight: '1px',
		display: 'flex',
		alignContent: 'end',
		justifyContent: 'space-between',
		backgroundColor: 'rgba(255, 255, 255, 0.6)'
		//background: 'linear-gradient(to top, #fff, rgba(0,0,0, 0))'
	},

	content: {
		position: 'absolute',
		zIndex: 2,
		bottom: 0,
		width: '100%'
	},
}));