import React, { useState } from "react";
import "./MainNavigation.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";
const MainNavigation = (props) => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const openDrawer = () => {
        setDrawerIsOpen(true);
    };
    const closeDrawer = () => {
        setDrawerIsOpen(false);
    };
    
    return (
        <React.Fragment>
            {drawerIsOpen && <Backdrop onClick={closeDrawer}/>}
            
            {drawerIsOpen && 
                <SideDrawer>
                    <nav className="main-navigation__drawer-nav">
                        <NavLinks />
                    </nav>
                </SideDrawer>
            }

            <MainHeader>
                <button className="main-navigation__menu-btn" onClick={openDrawer}>

                    <span />
                    <span />
                    <span />
                </button>
                <h1 className="main-navigation__title">
                    <Link to="/">Project</Link>
                </h1>
                <nav className="main-navigation__header-nav">
                    <NavLinks />
                </nav>
            </MainHeader>
        </React.Fragment>
    );
};

export default MainNavigation;