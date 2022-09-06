import React, {useState} from 'react';
import {Box, Collapse, Paper, Table, TableBody, TableCell, TableContainer, TableRow} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {ADMIN} from "../../utils/consts";
import ImageList from "./ImageList";
import EditTable from "./EditTable";
import DependencyRowTable from "./DependencyRowTable";
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import IButton from "../UI/IconButton/IButton";

const DependencyShow = ({contextScope, item, conf}) => {
	const [showDependency, setShowDependency] = useState({'': false})
	const [dependencyRenderArray, setDependencyRenderArray] = useState([])
	const [showAll, setShowAll] = useState(false)


	const handleShowDependency = (dependency, item, handleAll, handleAllValue) => {
		setShowDependency(prevState => (
				{
					...prevState, [dependency.name + item.id]:
						handleAll ? handleAllValue : !showDependency[dependency.name + item.id]
				}
			)
		)
		setDependencyRenderArray(prevState => (
			{
				...prevState,
				[dependency.name + item.id]:
					getContent(dependency, item)

			}
		))
	};

	const handleShowAll = () => {
		conf.dependencies && conf.dependencies.map(i => {
			handleShowDependency(i, item, true, !showAll)
		})
		setShowAll(!showAll)
	}

	const getContent = (dependency, item) => {
		return ADMIN[dependency.name].imageContent
			? <ImageList
				context={contextScope[dependency.name]}
				filters={{[dependency.field]: item.id}}
			/>
			: <EditTable
				isDependencyTable={true}
				parentContext={conf}
				context={contextScope[dependency.name]}
				filters={{[dependency.field]: item.id}}
			/>
	};

	return (
		<React.Fragment>
			{conf.dependencies && conf.dependencies.length > 0 &&
				<TableContainer component={Paper} sx={{overflowX: "unset"}}>
					<Table>
						<TableBody>
							<TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
								<TableCell style={{paddingBottom: 0, paddingTop: 0}}>
									<Box sx={{display: 'flex', flexDirection: 'row'}}>
										<IButton size="small" onClick={()=> handleShowAll()}>
											<UnfoldMoreIcon/>
										</IButton>

										{conf.dependencies && conf.dependencies.map(dependency =>
											<div key={dependency.name}
												 onClick={() => handleShowDependency(dependency, item)}
												 style={{cursor: "pointer", paddingInline: "0.6rem"}}>
												<IButton size="small">
													{showDependency[dependency.name + item.id]
														? <KeyboardArrowUpIcon/>
														: <KeyboardArrowDownIcon/>}
												</IButton>
												{dependency.inlineTitle}
											</div>
										)}
									</Box>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell style={{paddingBottom: 0, paddingTop: 0}}>
									{conf.dependencies && conf.dependencies.map(dependency =>
										<Collapse key={dependency.name} in={showDependency[dependency.name + item.id]}
												  timeout="auto" unmountOnExit>
											<DependencyRowTable
												content={dependencyRenderArray[dependency.name + item.id]}/>
										</Collapse>
									)}
								</TableCell>
							</TableRow>
							{showAll &&
								<TableRow>
									<TableCell>
										<IButton size="small" onClick={() => handleShowAll()}>
											<UnfoldMoreIcon/>
										</IButton>
									</TableCell>
								</TableRow>
							}
						</TableBody>
					</Table>

				</TableContainer>
			}
		</React.Fragment>
	);
};

export default DependencyShow;