import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {doFetch} from "../../http/storeAPI";
import Filter from "../../components/Admin/Filter/Filter";
import {ADMIN} from "../../utils/consts";
import DictAccordion from "../../components/UI/DictAccordion/DictAccordion";
import CreateVehicle from "../../components/modals/CreateVehicle";
import {Container} from "semantic-ui-react";
import {convertErrorMessage} from "../../utils/convertErrorMessage";
import {useSnackbar} from "notistack";

const StoresAdmin = observer(() => {
	const {enqueueSnackbar} = useSnackbar()
	const [storeVisible, setStoreVisible] = useState(false)
	const contextScope = useContext(Context)
	const [filters, setFilters] = useState({})
	const user = contextScope.user

	useEffect(() => {
		for (const obj of Object.values(contextScope)) {
			obj.noFetchContextFromBackend === undefined && doFetch(obj, '', '')
				.then(data => obj.setData(data.results))
				.catch(e => enqueueSnackbar(convertErrorMessage(e), {variant: "error"}));
		}
		// eslint-disable-next-line
	}, []);
	return (
		<Container>
			{user.isStaff
				?
				<>
					<h4 className="mt-3">Хранение</h4>
					<Filter
						conf={ADMIN.city}
						filterCallback={setFilters}
					/>
					<DictAccordion
						context={contextScope.city}
						filters={filters}
						modalVisible={storeVisible}
						setModalVisible={setStoreVisible}
						Create={CreateVehicle}
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

export default StoresAdmin;