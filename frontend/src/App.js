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
import SuccessModal from "./shared/components/UIElements/SuccessModal";

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;

  //state to manage the items we put in the cart
  const [cart, setCart] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const addToCartHandler = (item) => {
    const existingItemIndex = cart.findIndex((i) => i.id === item.id);

    if (existingItemIndex >= 0) {
      //either update item if it already exists
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += item.quantity;
      setCart(updatedCart);
      console.log(updatedCart)

      //update modal
      setModalMessage(
        `Added ${item.quantity} more ${item.name} to the cart.`
      );
    } else {
      //or add item to cart if it doesn't exist yet
      setCart((prevCart) => [...prevCart, item]);

      //modal for adding items
      setModalMessage(`Added ${item.quantity} ${item.name} to the cart.`);
    }

    //show modal for adding items to cart
    setModalVisible(true);
  };

  //if user deletes item from cart
  const removeFromCartHandler = (id) => {
    if (id === 0) {setCart([]);}
    const removedItem = cart.find((item) => item.id === id);
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));

    //modal for removing item
    if (removedItem) {
      setModalMessage(`${removedItem.name} was removed from the cart.`);
      setModalVisible(true);
    }
  };

  const closeModalHandler = () => {
    setModalVisible(false);
    setModalMessage("");
  };

  if (token) {
    //routes for logged-in users 
    routes = (
      <Switch>
        <Route path="/" exact>
          <Products onAddToCart={addToCartHandler} />
        </Route>
        <Route path="/cart" exact>
          <Cart cart={cart} onRemoveItem={removeFromCartHandler} />
        </Route>
        <Route path="/:userId/cart" exact>
          <PlaceHolder required="user's card and all products" />
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
          <Products onAddToCart={addToCartHandler} />
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
        <main>
          {routes}
          <SuccessModal
            show={modalVisible}
            onClear={closeModalHandler}
            message={modalMessage}
          />
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
