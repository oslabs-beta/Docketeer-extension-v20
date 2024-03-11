import React from "react";
import styles from './Modal.module.scss';
import { useAppSelector } from '../../../reducers/hooks';

interface ModalProps {
  trigger: boolean; // Change Boolean to boolean
  setTrigger: (value: boolean) => void;
}

const Modal = ({ trigger, setTrigger }: ModalProps): React.JSX.Element => {
  return trigger ? ( // if trigger true popup!
    <div className={styles.popup}>
      <div className={styles.popupInner}>
        <h2 className={styles.popuptitle}>Hello World</h2>
        <button className={styles.closeBtn} onClick={() => setTrigger(false)}>
          Close
        </button>
      </div>
    </div>
  ) : <></>; // else return nothing
};

export default Modal;
