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

const App = () => {
  return (
    <Router>
      <MainNavigation />
      <main>
        <Switch>
          <Route path="/" exact>
            <Products />
          </Route>
          <Route path="/:userId" exact>
          <PlaceHolder required='user"s account and details' />
          </Route>
          <Route path="/:userId/cart" exact>
          <PlaceHolder required='user"s card and all products' />
          </Route>
          <Redirect to="/"/>
        </Switch>
      </main>
    </Router>
  );
}

export default App;
