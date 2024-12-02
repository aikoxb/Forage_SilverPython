import React from "react";
import './App.css';
import Products from "./product/pages/Home";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Products />
        </Route>
        <Redirect to="/"/>
      </Switch>
    </Router>
    
  );
}

export default App;
