import React from 'react';
import {observer} from "mobx-react-lite";
import DictList from "../../DictList/DictList";
import {Accordion} from "react-bootstrap";


const DictAccordion = observer(({context, modalVisible, setModalVisible, Create}) => {

	return (
		<Accordion className="mt-3">
			<Accordion.Item eventKey="0">
				<Accordion.Header>
					{context.settings.title} ({context.data.length})
				</Accordion.Header>
				<Accordion.Body className="d-flex flex-column">
					<DictList
						context={context}
						showTitle={true}
					/>
					<Create show={modalVisible} onHide={() => setModalVisible(false)}/>
				</Accordion.Body>
			</Accordion.Item>
		</Accordion>
	);
});

export default DictAccordion;