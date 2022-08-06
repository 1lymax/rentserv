import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import SearchBar from "../components/SearchBar";

const Shop = () => {
    return (
        <Container>
            <Row className="mt-3">
                <Col md={3}>
                    <SearchBar></SearchBar>
                </Col>
                <Col md={9}>

                </Col>
            </Row>
        </Container>
    );
};

export default Shop;