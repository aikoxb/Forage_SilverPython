import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validator";
import { useForm } from "../../shared/hooks/form-hooks";
import { useHttpClient } from "../../shared/hooks/http-hooks";
import { AuthContext } from "../../shared/context/auth-context";
import "./OrderForm.css"; 

const UpdateOrder = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedOrder, setLoadedOrder] = useState();
  const orderId = useParams().orderId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      status: {
        value: "",
        isValid: false,
      },
      deliveryAddress: {
        value: "",
        isValid: false,
      },
      paymentStatus: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8080/api/orders/${orderId}`
        );
        setLoadedOrder(responseData.order);
        setFormData(
          {
            status: {
              value: responseData.order.status,
              isValid: true,
            },
            deliveryAddress: {
              value: responseData.order.deliveryAddress,
              isValid: true,
            },
            paymentStatus: {
              value: responseData.order.paymentStatus,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchOrder();
  }, [sendRequest, orderId, setFormData]);

  const orderUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:8080/api/orders/${orderId}`,
        "PATCH",
        JSON.stringify({
          status: formState.inputs.status.value,
          deliveryAddress: formState.inputs.deliveryAddress.value,
          paymentStatus: formState.inputs.paymentStatus.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/" + auth.userId + "/orders"); 
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedOrder && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find order!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedOrder && (
        <form className="order-form" onSubmit={orderUpdateSubmitHandler}>
          <Input
            id="status"
            element="input"
            type="text"
            label="Order Status"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid status."
            onInput={inputHandler}
            initialValue={loadedOrder.status}
            initialValid={true}
          />
          <Input
            id="deliveryAddress"
            element="textarea"
            label="Delivery Address"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid delivery address (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedOrder.deliveryAddress}
            initialValid={true}
          />
          <Input
            id="paymentStatus"
            element="input"
            type="text"
            label="Payment Status"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid payment status."
            onInput={inputHandler}
            initialValue={loadedOrder.paymentStatus}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE ORDER
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateOrder;
