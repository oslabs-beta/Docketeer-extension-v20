import React from 'react';
import './Modal.module.scss';

interface ModalProps {
  isOpen: boolean;
  handleClose: () => void;
  content: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, handleClose, content }) => {
  if (!isOpen) return null;

  return (
    <div className='modal'>
      <div className='modal-content'>
        <span className='close' onClick={handleClose}>
          &times;
        </span>
        {content}
      </div>
    </div>
  );
};

export default Modal;
