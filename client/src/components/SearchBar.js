import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {ListGroup} from "react-bootstrap";

const SearchBar = observer( () => {
	const {types} = useContext(Context)
	return (
		<ListGroup>
			{types.types.map(type =>
				<ListGroup.Item
					style={{cursor: "pointer"}}
					active={type.id === types.selectedType.id}
					onClick={() => types.setSelectedType(type)}
					key={type.id}
				>
					{type.name}
				</ListGroup.Item>
			)}
		</ListGroup>
	);
})

export default SearchBar;