import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import { useHttpClient } from "../../shared/hooks/http-hooks";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
} from "../../shared/util/validator";
import { useForm } from "../../shared/hooks/form-hooks";

import "./OrderForm.css";

const NewOrder = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler] = useForm(
    {
      orderStatus: {
        value: "",
        isValid: false,
      },
      deliveryName: {
        value: "",
        isValid: false,
      },
      deliveryAddress: {
        value: "",
        isValid: false,
      },
      paymentMethod: {
        value: "",
        isValid: false,
      },
      paymentStatus: {
        value: "",
        isValid: false,
      },
      products: {
        value: [],
        isValid: true, 
      },
    },
    false
  );

  const history = useHistory();

  const orderSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("userId", auth.userId);
      formData.append("orderStatus", formState.inputs.orderStatus.value);
      formData.append("deliveryName", formState.inputs.deliveryName.value);
      formData.append("deliveryAddress", formState.inputs.deliveryAddress.value);
      formData.append("paymentMethod", formState.inputs.paymentMethod.value);
      formData.append("paymentStatus", formState.inputs.paymentStatus.value);
      formData.append("products", JSON.stringify(formState.inputs.products.value));
      
      await sendRequest("http://localhost:8080/api/orders", "POST", formData, {
        Authorization: "Bearer " + auth.token,
      });
      history.push("/orders"); 
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="order-form" onSubmit={orderSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="orderStatus"
          element="input"
          type="text"
          label="Order Status"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid order status."
          onInput={inputHandler}
        />
        <Input
          id="deliveryName"
          element="input"
          type="text"
          label="Delivery Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter the delivery name."
          onInput={inputHandler}
        />
        <Input
          id="deliveryAddress"
          element="input"
          type="text"
          label="Delivery Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <Input
          id="paymentMethod"
          element="input"
          type="text"
          label="Payment Method"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid payment method."
          onInput={inputHandler}
        />
        <Input
          id="paymentStatus"
          element="input"
          type="text"
          label="Payment Status"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid payment status."
          onInput={inputHandler}
        />
        <Input
          id="products"
          element="textarea"
          label="Products (JSON format)"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter product details."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD ORDER
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewOrder;
