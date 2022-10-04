import {observer} from "mobx-react-lite";
import React, {useContext} from 'react';

import {Context} from "../../index";
import {ADMIN} from "../../utils/consts";
import ShowSingleContext from "../../components/Admin/ShowSingleContext/ShowSingleContext";

const VehiclesAdmin = observer(() => {
	const contextScope = useContext(Context)

	return (
		<ShowSingleContext context={contextScope.vehicle} conf={ADMIN.vehicle} header="Transport"/>
	);
});

export default VehiclesAdmin;