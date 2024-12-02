import React from "react";

import Modal from "./Modal"; 
import Button from "../FormElements/Button";  

const SuccessModal = (props) => {
  return (
    <Modal
      onCancel={props.onClear}
      header="Success!"
      show={props.show}  
      footer={<Button onClick={props.onClear}>Okay</Button>} 
    >
      <p>{props.message}</p> 
    </Modal>
  );
};

export default SuccessModal;
