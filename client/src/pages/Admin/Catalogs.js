import React, {useContext, useEffect} from 'react';
import {observer} from "mobx-react-lite";

import {Context} from "../../index";
import DictAccordion from "../../components/UI/DictAccordion/DictAccordion";
import {doFetch} from "../../http/storeAPI";
import {Container} from "semantic-ui-react";
import {getErrorMessage} from "../../utils/getErrorMessage";
import {useSnackbar} from "notistack";

const Catalogs = observer(() => {
	const {enqueueSnackbar} = useSnackbar()
	const contextScope = useContext(Context)
	const user = contextScope.user

	useEffect(() => {
		for (const obj of Object.values(contextScope)) {
			obj.noFetchContextFromBackend === undefined &&
			doFetch(obj, '','','', obj?.auth)
				.then(data => obj.setData(data.results))
				.catch(e => enqueueSnackbar(getErrorMessage(e), {variant: "error"}));
		}
		//eslint-disable-next-line
	}, [contextScope]);

	return (
		<Container>
			{user.isStaff
				?
				<>
					<h4 className="mt-3">Транспорт</h4>
					<DictAccordion context={contextScope.type}/>

					<DictAccordion context={contextScope.feature}/>

					<DictAccordion context={contextScope.unit}/>

					<DictAccordion context={contextScope.vehicleFeature}/>

					{/*<h4 className="mt-4">Склады</h4>*/}

					{/*<DictAccordion*/}
					{/*	context={cities}*/}
					{/*	conf={ADMIN.city}*/}
					{/*	modalVisible={cityVisible}*/}
					{/*	setModalVisible={setCityVisible}*/}
					{/*	Create={CreateVehicle}*/}
					{/*/>*/}
				</>
				:
				<div>
					Нет прав для просмотра
				</div>

			}

		</Container>
	);
});

export default Catalogs;