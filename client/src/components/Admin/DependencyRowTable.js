import React from 'react';
import {Box, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";

const DependencyRowTable = ({content}) => {

	return (
		<Box sx={{margin: 0}}>
			<Table>
				<TableHead>
					<TableRow>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell>{content}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Box>


	);
};

export default DependencyRowTable;