import React, {useState} from 'react';
import classes from "./EditTable.module.css";
import {Col, Row} from "react-bootstrap";
import EditTable from "./EditTable";

const DependencyRowTable = ({contextScope, dependency, item, conf}) => {
	const [showDependency, setShowDependency] = useState({'': false})
	const [dependencyRenderArray, setDependencyRenderArray] = useState([])

	const handleShowDependency = (dependency, item) => {
		setShowDependency(prevState => (
				{
					...prevState, [dependency.name + item.id]:
						!showDependency[dependency.name + item.id]
				}
			)
		)
		setDependencyRenderArray(prevState => (
			{
				...prevState,
				[dependency.name + item.id]:
					<EditTable
						isDependencyTable={true}
						parentContext={conf}
						context={contextScope[dependency.name]}
						filters={{[dependency.field]: item.id}}
					/>
			}
		))
	};

	return (
		<Row key={dependency.name}
			 className={["ms-4 me-4 flex-shrink-1", showDependency[dependency.name + item.id] ? classes.dict__item : ''].join(' ')}
		>
			<Col style={{cursor: 'pointer'}}
				 onClick={() => handleShowDependency(dependency, item)}
			>
				{dependency.inlineTitle} {!showDependency[dependency.name + item.id] ? '>>' : '<<'}
			</Col>
			<Col className="col-12" hidden={!showDependency[dependency.name + item.id]}>
				{dependencyRenderArray[dependency.name + item.id]}
			</Col>
		</Row>
	);
};

export default DependencyRowTable;