import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Button, Divider, Dropdown, Grid, Icon, Image, Input, Label, Modal} from "semantic-ui-react";

import {API_URL} from "../../http";
import {Context} from "../../index";
import {addToCart, fetchCart, removeFromCart} from "../../http/storeAPI";

import classes from "./Cart.module.css";
import {convertErrorMessage} from "../../utils/convertErrorMessage";
import {useSnackbar} from "notistack";
import {MESSAGES} from "../../utils/consts";

const Cart = observer(() => {
	const {enqueueSnackbar} = useSnackbar()
	const [openCart, setOpenCart] = useState(false);
	const [inputData, setInputData] = useState({});

	const {cart} = useContext(Context)

	useEffect(() => {
		fetchCart()
			.then(resp => {
				cart.setData(resp)
				setInputData(cart.data)
			})
			.catch(e => enqueueSnackbar(convertErrorMessage(e), {variant: "error"}));
		//eslint-disable-next-line
	}, [cart.needFetch]);

	const handleRemoveItem = (e, id) => {
		removeFromCart(id)
			.then(resp => {
					cart.setData(resp)
					setInputData(cart.data)
					enqueueSnackbar(MESSAGES.cartAdd, {variant: "success"})
				}
			)
			.catch(e => enqueueSnackbar(convertErrorMessage(e), {variant: "error"}));
	};

	const handleInputChange = (e, id, quantity) => {
		addToCart(id, {id: id, quantity})
			.then(resp => {
					cart.setData(resp)
					setInputData(cart.data)
					enqueueSnackbar(MESSAGES.cartAdd, {variant: "success"})
				}
			)
			.catch(e => enqueueSnackbar(convertErrorMessage(e), {variant: "error"}));
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
					{Object.entries(cart.data).length < 2 &&
						<div style={{
							textAlign: "center",
							color: "gray",
							fontSize: "2rem",
							marginTop: "2rem",
							marginBottom: "4rem"
						}}>
							Cart is empty :( <br/>
							<Icon name="time"/> Time to fix this!
						</div>
					}
					{Object.entries(cart.data).map(item =>
						(
							<Grid key={item[0]} centered className={classes.cartRow}>
								{item[1].name &&
									<>
										<Grid.Row className={classes.cartRow}>
											<Grid.Column className={classes.cartCell}>
												<div style={{width: "23%"}}>
													<Image
														src={[API_URL, item[1].image].join(" ").replace("/ /", "/")}></Image>
												</div>
												<div style={{width: "60%", textAlign: "left"}}>
													<h4>{item[1].name}</h4>
												</div>
												<div style={{width: "17%", textAlign: "right"}}>
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
											<Grid.Column className={[classes.cartCell, classes.cellQuantity].join(" ")}>
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
											<Grid.Column className={[classes.cartCell, classes.cellPrice].join(" ")}>
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