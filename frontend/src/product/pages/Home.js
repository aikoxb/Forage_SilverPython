import React from "react";

import ProductList from "../components/ProductList"
import "./Home.css"

const Products = (props) => {
    const PRODUCTS = [
        {
            id: "p1",
            name: "White Bread",
            price: 2.99,
            itemDescription: "A single load of white bread.",
            image: "placeholder.jpg"
        },
        {
            id: "p2",
            name: "Milk",
            price: 4.99,
            itemDescription: "3L jug of milk.",
            image: "placeholder.jpg"
        },
        {
            id: "p3",
            name: "Eggs",
            price: 3.99,
            itemDescription: "A dozen large eggs.",
            image: "placeholder.jpg"
        },
        {
            id: "p4",
            name: "Apples (per lb)",
            price: 1.99,
            itemDescription: "Honeycrisp Apples.",
            image: "placeholder.jpg"
        },
        {
            id: "p5",
            name: "Bag of Rice",
            price: 9.99,
            itemDescription: "5lb bag of rice.",
            image: "placeholder.jpg"
        },
        {
            id: "p6",
            name: "Pack of Butter",
            price: 5.99,
            itemDescription: "1lb of Butter.",
            image: "placeholder.jpg"
        },
        {
            id: "p7",
            name: "Tomatoes (per lb)",
            price: 2.99,
            itemDescription: "Heirloom tomatoes.",
            image: "placeholder.jpg"
        },
        {
            id: "p8",
            name: "Bag of Potatoes",
            price: 2.99,
            itemDescription: "5lb of Yukon potatoes.",
            image: "placeholder.jpg"
        },
        {
            id: "p9",
            name: "Onions (per lb)",
            price: 1.00,
            itemDescription: "Classic white onion.",
            image: "placeholder.jpg"
        } 
    ];

    return <ProductList items={PRODUCTS} onAddToCart={props.onAddToCart} />;

};

export default Products;