import React from "react";

import "./ProductItem.css"

const ProductItem = (props) => {
    return (
        <li className="user-item">
          <div className="user-item__content">
              <div className="user-item__image">
                <img src={props.image} alt={props.name}/>
              </div>
              <div className="user-item__info">
                <h2>{props.name}</h2>
                <h3> 
                  {"$ "+props.price}{props.price % 1 === 0 ? ".00" : ""}
                </h3>
              </div>
          </div>
        </li>
      );;
  };
  
  export default ProductItem;