import React, {useState} from 'react';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import {ADMIN} from "../../../utils/consts";
import ImageList from "../ImageList/ImageList";
import EditTable from "../EditTable";
import IButton from "../../UI/IconButton/IButton";
import classes from "./DependencyShow.module.css"
import {Transition} from "semantic-ui-react";

const DependencyShow = ({contextScope, item, conf}) => {
	const [showDependency, setShowDependency] = useState({'': false})
	const [dependencyRender, setDependencyRender] = useState([])
	const [showAll, setShowAll] = useState(false)

	const handleShowDependency = (dependency, item, handleAll, handleAllValue) => {
		setShowDependency(prevState => (
				{
					...prevState, [dependency.name + item.id]:
						handleAll ? handleAllValue : !showDependency[dependency.name + item.id]
				}
			)
		)
		setDependencyRender(prevState => (
			{
				...prevState,
				[dependency.name + item.id]:
					getContent(dependency, item)

			}
		))
	};

	const handleShowAll = () => {
		// eslint-disable-next-line
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
			<div className={classes.collapse_wrapper}>
				<div>
					<IButton size="small" onClick={() => handleShowAll()}>
						<UnfoldMoreIcon/>
					</IButton>
				</div>
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
			</div>
			{conf.dependencies && conf.dependencies.map(dependency =>
				<Transition key={dependency.name} animation="zoom" duration={400}
							mountOnShow
							visible={showDependency[dependency.name + item.id]}
				>
					<div>
						{dependencyRender[dependency.name + item.id]}
					</div>
				</Transition>
			)}
			{showAll &&
				<IButton size="small" onClick={() => handleShowAll()}>
					<UnfoldMoreIcon/>
				</IButton>
			}
		</React.Fragment>
	);
};

export default DependencyShow;