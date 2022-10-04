import {useSnackbar} from "notistack";
import {observer} from "mobx-react-lite";
import React, {useContext, useEffect, useState} from 'react';
import {Container, Dropdown, Grid, Header} from "semantic-ui-react";

import {Context} from "../../../index";
import {doFetch} from "../../../http/storeAPI";
import Filter from "../../../components/Admin/Filter/Filter";
import {getErrorMessage} from "../../../utils/getErrorMessage";
import EditTable from "../../../components/Admin/EditTable/EditTable";

const ShowSingleContext = observer(({conf, context, header}) => {
	const {enqueueSnackbar} = useSnackbar()
	const contextScope = useContext(Context)
	const [filters, setFilters] = useState({})
	const [showFilter, setShowFilter] = useState(false)
	const user = contextScope.user

	useEffect(() => {
		for (const obj of Object.values(contextScope)) {
			obj.noFetchContextFromBackend === undefined && doFetch(obj, '', '', '', obj?.auth)
				.then(data => {
					obj.setData(data.results)
					obj.aggregate && obj.setAggregate(data.aggregate)
				})
				.catch(e => enqueueSnackbar(getErrorMessage(e), {variant: "error"}));
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
							<Header as="h3">{header}</Header>
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
							conf={conf}
							aggregate={context.aggregate && context.aggregate}
							filterCallback={setFilters}
						/>
					</div>
					<EditTable
						filters={filters}
						context={context}
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

export default ShowSingleContext;