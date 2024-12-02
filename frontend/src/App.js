import React, { useState } from "react";
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
import Cart from "./product/pages/Cart";

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

  //state to manage the items we put in the cart
  const [cart, setCart] = useState([]);

  const addToCartHandler = (item) => {
    const existingItemIndex = cart.findIndex((i) => i.id === item.id);

    if (existingItemIndex >= 0) {
      //either update item if it already exists
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += item.quantity;
      setCart(updatedCart);
    } else {
      //or add item to cart if it doesn't exist yet
      setCart((prevCart) => [...prevCart, item]);
    }
  };

  //if user deletes item from cart
  const removeFromCartHandler = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

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
        <main>
        <Switch>
          <Route path="/" exact>
            <Products onAddToCart={addToCartHandler} />
          </Route>
          <Route path="/cart" exact>
            <Cart cart={cart} onRemoveItem={removeFromCartHandler} />
          </Route>
          <Redirect to="/"/>
        </Switch>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
