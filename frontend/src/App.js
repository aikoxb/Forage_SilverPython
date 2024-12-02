import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Users from "./user/pages/Users";
import NewOrder from "./orders/pages/NewOrder"; 
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserOrders from "./orders/pages/UserOrders"; 
import UpdateOrder from "./orders/pages/UpdateOrder"; 
import Auth from "./user/pages/Auth";
import Account from "./user/pages/Account";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hooks";

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    //routes for logged-in users 
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/orders" exact>
          <UserOrders /> 
        </Route>
        <Route path="/orders/new" exact>
          <NewOrder /> 
        </Route>
        <Route path="/orders/:orderId">
          <UpdateOrder /> 
        </Route>
        <Route path="/account" exact>
          <Account />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    //routes for non-logged-in users
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
