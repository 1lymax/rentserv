import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";

import {Context} from "../../index";
import {ADMIN} from "../../utils/consts";
import ShowSingleContext from "../../components/Admin/ShowSingleContext/ShowSingleContext";

const StoresAdmin = observer(() => {
	const contextScope = useContext(Context)

	return (
		<ShowSingleContext context={contextScope.city} conf={ADMIN.city} header="Stores"/>
	);
});

export default StoresAdmin;