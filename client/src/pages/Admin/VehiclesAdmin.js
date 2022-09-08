import React, {useContext, useEffect, useState} from 'react';

import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {doFetch} from "../../http/storeAPI";
import {ADMIN} from "../../utils/consts";
import Filter from "../../components/Admin/Filter";
import EditTable from "../../components/Admin/EditTable";
import {Container} from "@mui/material";

const VehiclesAdmin = observer(() => {
	const contextScope = useContext(Context)
	const [filters, setFilters] = useState({})
	const user = contextScope.user

	useEffect(() => {
		for (const obj of Object.values(contextScope)) {
			obj.noFetchContextFromBackend === undefined && doFetch(obj, '', '')
				.then(data => {
					obj.setData(data.results)
					obj.aggregate && obj.setAggregate(data.aggregate)
				})
		}
	}, []);

	return (
		<Container className="d-flex flex-column">
			{user.isStaff
				?
				<>
					<h4 className="mt-3">Транспорт</h4>
					<Filter
						conf={ADMIN.vehicle}
						filterCallback={setFilters}
						aggregate={contextScope.vehicle.aggregate}

					/>
					<EditTable
						context={contextScope.vehicle}
						filters={filters}
						showTitle={true}
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