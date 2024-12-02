import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hooks";
import "./OrderItem.css";

const OrderItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false); 

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:8080/api/orders/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };
  
  // Debugging logs
  console.log("Auth User ID:", auth.userId);
  console.log("Props User ID:", props.userId);
  console.log("Condition for buttons:", auth.userId === props.userId);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="order-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this order? This action cannot be undone.
        </p>
      </Modal>
      <li className="order-item">
        <Card className="order-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="order-item__info">
            <p>Order Status: {props.orderStatus}</p>
            <p>Delivery Name: {props.deliveryName}</p>
            <p>Delivery Address: {props.deliveryAddress}</p>
            <p>Payment Method: {props.paymentMethod}</p>
            <p>Payment Status: {props.paymentStatus}</p>
            <p>Order Date: {new Date(props.creationDate).toLocaleDateString()}</p>
          </div>
          
          <div className="order-item__actions">
            {auth.userId && auth.userId === props.userId && (
              <Button to={`/orders/${props.id}`}>EDIT</Button>
            )}
            {auth.userId && auth.userId === props.userId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default OrderItem;
