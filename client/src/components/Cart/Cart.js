import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Button, Divider, Dropdown, Grid, Icon, Image, Input, Label, Modal} from "semantic-ui-react";

import {API_URL} from "../../http";
import {Context} from "../../index";
import {addToCart, fetchCart, removeFromCart} from "../../http/storeAPI";

import classes from "./Cart.module.css";

const Cart = observer(() => {
	const [openCart, setOpenCart] = useState(false);
	const [inputData, setInputData] = useState({});

	const {cart} = useContext(Context)

	useEffect(() => {
		fetchCart()
			.then(resp => {
				cart.setData(resp)
				setInputData(cart.data)
			})
		//eslint-disable-next-line
	}, [cart.needFetch]);

	const handleRemoveItem = (e, id) => {
		removeFromCart(id)
			.then(resp => {
					cart.setData(resp)
					setInputData(cart.data)
				}
			)
	};

	const handleInputChange = (e, id, quantity) => {
		addToCart(id, {id: id, quantity})
			.then(resp => {
					cart.setData(resp)
					setInputData(cart.data)
				}
			)
	}
	return (
		<Modal
			centered
			className={classes.cartModal}
			open={openCart}
			onClose={() => setOpenCart(false)}
			onOpen={() => setOpenCart(true)}
			trigger={
				<Button className={classes.buttonAddRemove}>
					<Icon name="cart" size="large"/>
					{cart.data.total.quantity > 0 &&
						<Label circular color="red" size="tiny" attached="top right">{cart.data.total.quantity}</Label>
					}
				</Button>
			}
		>
			<Modal.Header><h1><Icon name='shop'/> Your Cart</h1></Modal.Header>
			<Modal.Content scrolling>
				<Modal.Description>
					{Object.entries(cart.data).map(item =>
						(
							<Grid key={item[0]} centered className={classes.cartRow}>
								{item[1].name &&
									<>
										<Grid.Row className={classes.cartRow}>
											<Grid.Column className={classes.cartCell}>
												<Image src={[API_URL, item[1].image].join(" ").replace("/ /", "/")}></Image>
												<div><h4>{item[1].name}</h4></div>
												<div>
													<Dropdown icon='ellipsis vertical' direction="left">
														<Dropdown.Menu>
															<Dropdown.Item
																onClick={e => handleRemoveItem(e, item[1].id)}>Delete</Dropdown.Item>
														</Dropdown.Menu>
													</Dropdown>
												</div>
											</Grid.Column>
										</Grid.Row>
										<Grid.Row className={classes.cartRow}>
											<Grid> </Grid>
											<Grid> </Grid>
											<Grid.Column className={classes.cartCell + ' ' + classes.cellQuantity}>
												<Button icon="minus" circular size="small"
														className={classes.buttonAddRemove}
														onClick={e => handleInputChange(e, item[1].id, inputData[item[1].id]?.quantity - 1)}/>
												<Input value={inputData[item[1].id]?.quantity}
													   className={classes.quantity_input}
													   onChange={e => handleInputChange(e, item[1].id, parseInt(e.target.value))}/>
												<Button icon="add" circular size="small"
														className={classes.buttonAddRemove}
														onClick={e => handleInputChange(e, item[1].id, inputData[item[1].id]?.quantity + 1)}/>
											</Grid.Column>
											<Grid.Column className={classes.cartCell + ' ' + classes.cellPrice}>
												<h2>{item[1].price}</h2>
											</Grid.Column>
										</Grid.Row>
										<Divider/>
									</>
								}
							</Grid>
						))
					}
				</Modal.Description>
			</Modal.Content>
			<Modal.Actions className={classes.actions}>
				<div className={classes.total_wrapper}>
					<div><h2>Total:</h2></div>
					{/*<Input*/}
					{/*	label={{tag: true, content: 'Total', pointing: 'right'}}*/}
					{/*	labelPosition='left'*/}
					{/*	value={cart.data.total.price}*/}
					{/*	size={"large"}*/}
					{/*	style={{width: '100px', textAlign: 'right'}}*/}
					{/*/>*/}

					<div><h2>{cart.data.total.price}</h2></div>
				</div>
				<Button.Group>
					<Button onClick={() => setOpenCart(false)}>
						<Icon name='shopping bag'/>Continue shopping
					</Button>
					<Button.Or/>
					<Button onClick={() => setOpenCart(false)} primary>
						Proceed to order<Icon name='chevron right'/>
					</Button>
				</Button.Group>
			</Modal.Actions>
		</Modal>
	);
})

export default Cart;