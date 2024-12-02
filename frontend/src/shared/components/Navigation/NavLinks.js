import React from "react";
import { NavLink } from "react-router-dom";
import "./NavLinks.css";

const NavLinks = (props) => {
    return (
        <ul className="nav-links">
            <li><NavLink to="/">Home Page</NavLink></li>
            <li><NavLink to="/">Change Links</NavLink></li>

            {/*<li><NavLink to="/auth">Authenticate</NavLink></li>
            <li><NavLink to=""></NavLink></li>
            <li><NavLink to=""></NavLink></li>*/}

        </ul>
    );
};

export default NavLinks;