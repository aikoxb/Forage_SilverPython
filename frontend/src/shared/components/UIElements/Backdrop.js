import React from "react";
import "./Backdrop.css";

import ReactDOM from "react-dom";
const Backdrop = (props) => {
    const content = <div className="backdrop" onClick={props.onClick}></div>
    return ReactDOM.createPortal(content, document.getElementById("backdrop-hook"));
};

export default Backdrop;