import React from 'react';
import {observer} from "mobx-react-lite";
import EditTable from "../../EditTable/EditTable";
import {Accordion} from "react-bootstrap";


const DictAccordion = observer(({context, conf, filters}) => {
	return (
		<Accordion className="mt-3">
			<Accordion.Item eventKey="0">
				<Accordion.Header>
					{context.settings.title} ({context.data.length})
				</Accordion.Header>
				<Accordion.Body className="d-flex flex-column">
					<EditTable
						context={context}
						filters={filters}
						conf={conf}
						showTitle={true}
					/>
					{/*<Create show={modalVisible} onHide={() => setModalVisible(false)}/>*/}
				</Accordion.Body>
			</Accordion.Item>
		</Accordion>
	);
});

export default DictAccordion;