import React from "react";
import "./Cart.css";
import Card from "../../shared/components/UIElements/Card";

const Cart = (props) => {
  const TAX_RATE = 0.13;

  const cart = props.cart || [];

  let subtotal = 0;
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    subtotal += item.price * item.quantity;
  }

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      <div className="cart-page">
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              <Card className="cart-item">
                <div className="cart-item__content">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item__image"
                  />
                  
                  <div className="cart-item__name">
                    <h2>{item.name}</h2>
                  </div>
                  <div className="cart-item__details">
                    <p><span className="text-bold">Quantity:</span> {item.quantity}</p>
                    <p><span className="text-bold">Price:</span> ${item.price.toFixed(2)}</p>
                  </div>
                  <button onClick={() => props.onRemoveItem(item.id)}>
                    Remove
                  </button>                  
                </div>
              </Card>
            </li>
          ))}
        </ul>
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="subtotal-tax">
            <p><span className="text-bold">Subtotal:</span> ${subtotal.toFixed(2)}</p>
            <p><span className="text-bold">Tax:</span> ${tax.toFixed(2)}</p>
          </div><hr></hr>       
          <p><span className="summary-total">Total:</span> ${total.toFixed(2)}</p>
          <button className="place-order">Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
