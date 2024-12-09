import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hooks";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import SuccessModal from "../../shared/components/UIElements/SuccessModal";
import "./Cart.css";
import Card from "../../shared/components/UIElements/Card";

const Cart = (props) => {
  const auth = useContext(AuthContext); //Access logged-in user's details
  const { error, sendRequest, clearError } = useHttpClient(); //HTTP client for API requests
  const [userData, setUserData] = useState(); //Store user data
  const [showSuccessModal, setShowSuccessModal] = useState(false); //Show success modal

  const TAX_RATE = 0.13;

  const cart = props.cart || [];

  let subtotal = 0;
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    subtotal += item.price * item.quantity;
  }

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

   //Get user details
   useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8080/api/users/${auth.userId}`
        );
        console.log("User details response:", responseData);
        setUserData(responseData.user);
      } catch (err) {
        console.error("Failed to get user details:", err);
      }
    };    
    fetchUserDetails();
  }, [auth.userId, sendRequest]);

  //Submits the cart order by sending the prepared data to the backend API
  const onSubmitHandler = async () => {
    if (!userData) {
      console.error("User data is not loaded.");
      return;
    }

    //Create order with necessary details
    const order = {
      userId: auth.userId, //Logged-in user's ID
      deliveryName: userData.name, //Get name from fetched user data
      deliveryAddress: userData.address, //Get address from fetched user data
      products: cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
      })),
    };

    try {
      //Send POST request to backend to create order
      const responseData = await sendRequest(
        "http://localhost:8080/api/orders", //Endpoint for orders
        "POST",
        JSON.stringify(order),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`, //Add authorization token for accessing secured routes
        }
      );
      console.log("Order placed successfully:", responseData); //Log response from the backend
      setShowSuccessModal(true);
      props.onRemoveItem(0);  //once sent, removes the whole cart
    } catch (err) {
      console.error("Failed to place order:", err); //Error log for debugging
    }
  };

  const clearSuccessModal = () => {
    setShowSuccessModal(false); //Close success modal
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
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
            <button className="place-order" onClick={onSubmitHandler}>Place Order</button>
          </div>
        </div>
      </div>
      {showSuccessModal && (
        <SuccessModal
          message="Order placed successfully!"
          onClear={clearSuccessModal}
          show={showSuccessModal}
        />
      )}
    </React.Fragment>
  );
};

export default Cart;
