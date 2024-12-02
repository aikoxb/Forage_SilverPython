import React from "react";
import './App.css';
import Products from "./product/pages/Home";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import PlaceHolder from "./shared/pages/PlaceHolder";
import MainNavigation from "./shared/components/Navigation/MainNavigation";

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
          <Products />
        </Route>
        
        <Route path="/:userId/cart" exact>
          <PlaceHolder required='user"s card and all products' />
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
          <Products />
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
}

export default App;
