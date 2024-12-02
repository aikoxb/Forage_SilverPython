import React from "react";
import OrderItem from "./OrderItem"; 
import Button from "../../shared/components/FormElements/Button";

const OrderList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="order-list center">
        <h2>No orders found. Maybe create one?</h2>
        <Button to="/orders/new">Create Order</Button>
      </div>
    );
  }

  return (
    <ul className="order-list">
      {props.items.map((order) => (
        <OrderItem
          key={order.id}
          id={order.id}
          orderStatus={order.orderStatus} 
          deliveryName={order.deliveryName}
          deliveryAddress={order.deliveryAddress}
          paymentMethod={order.paymentMethod}
          paymentStatus={order.paymentStatus}
          products={order.products}
          onDelete={props.onDeleteOrder} 
        />
      ))}
    </ul>
  );
};

export default OrderList;
