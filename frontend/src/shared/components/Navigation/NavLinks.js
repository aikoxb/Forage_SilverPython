import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./NavLinks.css";
import { AuthContext } from "../../context/auth-context";

const NavLinks = (props) => {
    const auth = useContext(AuthContext);

    return (
        <ul className="nav-links">
            <li><NavLink to="/" exact>Home Page</NavLink></li>
            {/*<li><NavLink to="/auth">Authenticate</NavLink></li>
            <li><NavLink to=""></NavLink></li>
            <li><NavLink to=""></NavLink></li>*/}

            {auth.isLoggedIn && ( /*Only return cart Nav link if user is logged in*/
                <li>
                <NavLink to="/cart" exact>Cart</NavLink>
                </li>        
            )}
            {auth.isLoggedIn && ( /*Only return account Nav link if user is logged in*/
                <li>    
                <NavLink to="/account" exact>Account</NavLink>
                </li>
            )}
            {!auth.isLoggedIn && (
                <li className="login-button">
                <NavLink to="/auth">Login</NavLink>
                </li>
            )}
            {auth.isLoggedIn && (
                <li>
                <button onClick={auth.logout} className="logout-button">
                    Logout
                </button>
                </li>
            )}
        </ul>
    );
};

export default NavLinks;