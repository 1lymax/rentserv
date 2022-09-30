import React, {useContext, useEffect, useState} from 'react';

import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {doFetch} from "../../http/storeAPI";
import {ADMIN} from "../../utils/consts";
import Filter from "../../components/Admin/Filter/Filter";
import EditTable from "../../components/Admin/EditTable/EditTable";
import {Container, Dropdown, Grid, Header} from "semantic-ui-react";

const VehiclesAdmin = observer(() => {
	const contextScope = useContext(Context)
	const [filters, setFilters] = useState({})
	const [showFilter, setShowFilter] = useState(false)
	const user = contextScope.user

	useEffect(() => {
		for (const obj of Object.values(contextScope)) {
			obj.noFetchContextFromBackend === undefined && doFetch(obj, '', '')
				.then(data => {
					obj.setData(data.results)
					obj.aggregate && obj.setAggregate(data.aggregate)
				})
		}
		// eslint-disable-next-line
	}, []);

	return (
		<Container>
			{user.isStaff
				?
				<>
					<Grid columns={2}>
						<Grid.Column textAlign={"left"}>
							<Header as="h3">Транспорт</Header>
						</Grid.Column>
						<Grid.Column textAlign={"right"}>
							<div style={{marginRight: "10px"}}>
								<Dropdown simple icon='ellipsis vertical' direction="left">
									<Dropdown.Menu>
										<Dropdown.Item
											onClick={() => setShowFilter(!showFilter)}
											icon="filter"
										text={!showFilter ? "Show filters": "Hide filters"}
										/>
									</Dropdown.Menu>
								</Dropdown>
							</div>
						</Grid.Column>
					</Grid>
					<div hidden={!showFilter}>
						<Filter
							conf={ADMIN.vehicle}
							aggregate={contextScope.vehicle.aggregate}
							filterCallback={setFilters}
						/>
					</div>
					<EditTable
						filters={filters}
						context={contextScope.vehicle}
					/>
				</>
				:
				<div>
					Нет прав для просмотра
				</div>

			}

		</Container>
	);
});

export default VehiclesAdmin;