import React from 'react';
import {Box, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";

const DependencyRowTable = ({content}) => {

	return (
		// <Row key={dependency.name}
		// 	 className={["ms-4 me-4 flex-shrink-1", showDependency[dependency.name + item.id] ? classes.dict__item : ''].join(' ')}
		// >
		// 	<Col style={{cursor: 'pointer'}}
		// 		 onClick={() => handleShowDependency(dependency, item)}
		// 	>
		// 		{dependency.inlineTitle} {!showDependency[dependency.name + item.id] ? '>>' : '<<'}
		// 	</Col>
		// 	<Col className="col-12" hidden={!showDependency[dependency.name + item.id]}>
		// 		{dependencyRenderArray[dependency.name + item.id]}
		// 	</Col>
		// </Row>
		<Box sx={{margin: 0}}>
			<Table>
				<TableHead>
					<TableRow>
						{/*<TableCell>Date</TableCell>*/}
						{/*<TableCell>Customer</TableCell>*/}
						{/*<TableCell align="right">Amount</TableCell>*/}
						{/*<TableCell align="right">Total price ($)</TableCell>*/}
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						{/*<TableCell component="th" scope="row">*/}

						{/*</TableCell>*/}
						<TableCell>{content}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Box>


	);
};

export default DependencyRowTable;