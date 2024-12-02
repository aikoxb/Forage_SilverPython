import React from "react";

import ProductItem from "./ProductItem";
import "./ProductList.css"


const ProductList = (props) => {
    if (props.items.length === 0) {
      return (
        <div className="center">
            <h2>No products found.</h2>
        </div>
      );
    }
  
    return (
      <ul className="products-list">
        {props.items.map((product) => (
          <ProductItem
            key={product.id}
            id={product.id}
            image={product.image}
            name={product.name}
            price={product.price}
            desc={product.itemDescription}
            onAddToCart={props.onAddToCart}
          />
        ))}
      </ul>
    );
  };
  
  export default ProductList;