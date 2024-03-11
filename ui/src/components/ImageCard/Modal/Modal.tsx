import React from "react";
import "./Modal.module.scss";

interface ModalProps {
  trigger: boolean; // Change Boolean to boolean
  setTrigger: (value: boolean) => void;
}

const Modal = ({ trigger, setTrigger }: ModalProps): React.JSX.Element => {
  return trigger ? ( // if trigger true popup!
    <div className="popup">
      <div className="popup-inner">
        <h2 className="popuptitle">Your Cohort Schedule</h2>
        <button className="close-btn" onClick={() => setTrigger(false)}>
          Close
        </button>
      </div>
    </div>
  ) : null; // else return nothing
};

export default Modal;
