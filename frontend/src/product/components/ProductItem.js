import React, { useState, useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import "./ProductItem.css"
import Card from "../../shared/components/UIElements/Card";

const ProductItem = (props) => {
  const { isLoggedIn } = useContext(AuthContext);

  const [quantity, setQuantity] = useState(1); //made 1 the default quantity

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1); //this stops quantity from going into the negatives
  };

  const addToCartHandler = () => {
    const item = {
      id: props.id,
      name: props.name,
      price: props.price,
      quantity: quantity,
      image: props.image
    };
    props.onAddToCart(item);
  };

  return (
    <li className="product-item">
      <Card className="product-item__card">
        <div className="product-item__content">
          <div className="product-item__image">
            <img src={props.image} alt={props.name} />
          </div>
          <div className="product-item__info">
            <h2>{props.name}</h2>
            <h3>{"$" + props.price}{props.price % 1 === 0 ? ".00" : ""}</h3>
            
            {isLoggedIn && (
              <>
                <div className="product-item__actions">
                  <button className="minus" onClick={decrementQuantity}>-</button>
                  <span>{quantity}</span>
                  <button className="plus" onClick={incrementQuantity}>+</button>
                </div>
                <button className="add-cart" onClick={addToCartHandler}>Add to Cart</button>
            </>
            )}
          {!isLoggedIn && <p>Please log in to manage your cart.</p>}
          </div>
        </div>
      </Card>
    </li>
  );
};
  
export default ProductItem;