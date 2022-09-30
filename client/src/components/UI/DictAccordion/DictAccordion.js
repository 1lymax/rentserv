import React, {useState} from 'react';
import {observer} from "mobx-react-lite";
import {Accordion, Icon} from "semantic-ui-react";

import EditTable from "../../Admin/EditTable/EditTable";


const DictAccordion = observer(({context, conf, filters}) => {
	const [active, setActive] = useState(false)

	return (
		<Accordion styled fluid>
			<Accordion.Title
				active={active}
				onClick={() => setActive(!active)}
			>
				<Icon name='dropdown'/>
				{context.settings.title} ({context.data.length})
			</Accordion.Title>
			<Accordion.Content active={active}>
				<EditTable
					context={context}
					filters={filters}
					conf={conf}
					showTitle={true}
				/>
			</Accordion.Content>
		</Accordion>
	);
});

export default DictAccordion;