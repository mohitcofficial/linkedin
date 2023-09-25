import React from "react";
import classes from "./LoadingModal.module.css";
import Loading from "../../assets/LoadingLoop.svg";

function LoadingModal({ closeModal }) {
  return (
    <div className={classes.container}>
      <img className={classes.image} src={Loading} alt="" />
      <button onClick={closeModal}>Close</button>
    </div>
  );
}

export default LoadingModal;
