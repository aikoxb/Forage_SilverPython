import React from "react";
import './App.css';
import Products from "./product/pages/Home";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
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
          <Redirect to="/"/>
        </Switch>
      </main>
    </Router>
  );
}

export default App;
