import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import OrderList from "../components/OrderList"; 
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hooks";
import { AuthContext } from "../../shared/context/auth-context";

const UserOrders = () => {
  const [loadedOrders, setLoadedOrders] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const userId = useParams().userId;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8080/api/orders/user/${userId}`,
          "GET",
          null, 
          {
            Authorization: "Bearer " + auth.token, 
          }
        );
        setLoadedOrders(responseData.orders); 
      } catch (err) {}
    };
    fetchOrders();
  }, [sendRequest, userId, auth.token]);

  const orderDeletedHandler = (deletedOrderId) => {
    setLoadedOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== deletedOrderId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedOrders && (
        <OrderList items={loadedOrders} onDeleteOrder={orderDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserOrders;
