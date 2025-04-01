import React, { useState } from 'react';
import styles from './FilterButton.module.scss';

// Type definitions
type ActionType = {
  id: string;
  label: string;
  handler: () => void;
};

interface FilterButtonProps {
  buttonText: string;
  actions: ActionType[];
}

const FilterButton: React.FC<FilterButtonProps> = ({ buttonText, actions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState<{ [key: string]: boolean }>({});

  const toggleModal = () => {
    console.log("opening modal:", isOpen)
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset selections when opening
      setSelectedActions({});
    }
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedActions({
      ...selectedActions,
      [id]: !selectedActions[id]
    });
  };

  const handleSubmit = () => {
    // Execute all selected actions
    actions.forEach(action => {
      if (selectedActions[action.id]) {
        action.handler();
      }
    });
    toggleModal();
  };

  return (
    <div className={styles["modal-button-container"]}>
      <button className={styles["primary-button"]} onClick={toggleModal}>
        {buttonText}
      </button>

      {isOpen && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal-content"]}>
            <div className={styles["modal-header"]}>
              <h2>Select Actions</h2>
              <button className={styles["close-button"]} onClick={toggleModal}>×</button>
            </div>
            
            <div className={styles["modal-body"]}>
              {actions.map((action) => (
                <div className={styles["checkbox-item"]} key={action.id}>
                  <input
                    type="checkbox"
                    id={action.id}
                    checked={!!selectedActions[action.id]}
                    onChange={() => handleCheckboxChange(action.id)}
                  />
                  <label htmlFor={action.id}>{action.label}</label>
                </div>
              ))}
            </div>
            
            <div className={styles["modal-footer"]}>
              <button className={styles["cancel-button"]} onClick={toggleModal}>
                Cancel
              </button>
              <button className={styles["submit-button"]} onClick={handleSubmit}>
                Apply Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterButton;