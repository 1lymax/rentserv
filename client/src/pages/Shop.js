import {observer} from "mobx-react-lite";
import {Container, Dropdown, Grid, Segment} from "semantic-ui-react";
import React, {useContext, useEffect, useRef, useState} from 'react';

import {Context} from "../index";
import {doFetch} from "../http/storeAPI";
import SearchBar from "../components/SearchBar";
import {PAGINATION} from "../utils/consts";
import {pageCount} from "../utils/pageCount";
import {useScroll} from "../hooks/useScroll";
import {useDidMountEffect} from "../hooks/useDidMountEffect";
import {useDebounce} from "../hooks/useDebounce";
import {useSnackbar} from "notistack";
import {getErrorMessage} from "../utils/getErrorMessage";
import VehicleItem from "../components/VehicleItem";

const Shop = observer(() => {
	const childRef = useRef()
	const parentRef = useRef()
	const {vehicle} = useContext(Context)
	const [filter, setFilter] = useState({})
	const [vehicleSorting, setVehicleSorting] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [totalRows, setTotalRows] = useState(0)
	const {enqueueSnackbar} = useSnackbar()
	const rowsPerPage = PAGINATION.rowsPerPageDefault

	const pagination = {
		page: currentPage,
		[PAGINATION.backendName]: rowsPerPage
	}

	useScroll(parentRef, childRef, () => fetchVehicles())

	useDidMountEffect(
		useDebounce(fetchFiltering, 500),
		[vehicleSorting, filter]
	)

	const sortingOptions = [
		{value: 'name', text: 'Name A-Z'},
		{value: '-name', text: 'Name Z-A'},
		{value: 'price_cap', text: 'Price A-Z'},
		{value: '-price_cap', text: 'Price Z-A'},
	]

	function needUseScrool() {
		return currentPage <= pageCount(totalRows, rowsPerPage) && vehicle.data.length < totalRows
	}

	function fetchVehicles() {
		if (needUseScrool()) {
			doFetch(vehicle, {ordering: vehicleSorting}, filter, pagination)
				.then(data => {
					vehicle.setData([...vehicle.data, ...data.results])
					setCurrentPage(currentPage + 1)
				})
				.catch(e => enqueueSnackbar(getErrorMessage(e), {variant: "error"}));
		}
	}

	function fetchFiltering() {
		doFetch(vehicle, {ordering: vehicleSorting}, filter, {
			page: 1,
			[PAGINATION.backendName]: rowsPerPage
		})
			.then(data => {
				vehicle.setData(data.results)
				setTotalRows(data.count)
				setCurrentPage(2)
			})
			.catch(e => enqueueSnackbar(getErrorMessage(e), {variant: "error"}));
	}

	useEffect(() => {
		doFetch(vehicle)
			.then(data => {
				vehicle.setAggregate(data.aggregate)
				setTotalRows(data.count)
			})
			.catch(e => enqueueSnackbar(getErrorMessage(e), {variant: "error"}));
		// eslint-disable-next-line
	}, []);

	return (
		<Container fluid>
			<Grid columns={2} centered>
				<Grid.Row>
					<Grid.Column width={4}>
						<Segment>
							<SearchBar setFilter={setFilter}></SearchBar>
						</Segment>
					</Grid.Column>
					<Grid.Column width={11}>
						<div style={{maxWidth: "180px", marginBottom: "20px"}}>
							<Dropdown fluid
									  labeled
									  floating
									  selection
									  clearable
									  openOnFocus
									  selectOnBlur={false}
									  value={vehicleSorting}
									  options={sortingOptions}
									  placeholder={"Sort"}
									  onChange={(e, props) =>
										  e ? setVehicleSorting(props.value) : setVehicleSorting(undefined)
									  }
							/>
						</div>
						<div ref={parentRef}>
							<Grid>
								{vehicle.data.map(vehicle =>
									<Grid.Column mobile={16} tablet={8} computer={5} key={vehicle.id}>
										<VehicleItem vehicle={vehicle}></VehicleItem>
									</Grid.Column>
								)}
							</Grid>
							<div ref={childRef} style={{height: '20px'}}></div>
						</div>

					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Container>
	);
});

export default Shop;