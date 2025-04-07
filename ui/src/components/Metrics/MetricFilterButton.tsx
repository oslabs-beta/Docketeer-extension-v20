import React, { useState } from "react";
import styles from "./MetricFilterButton.module.scss";

// This is the same modal button as FilterButton.tsx, but with different options for Container Metrics specifically

// Type definitions
type ActionType = {
  id: string;
  label: string;
  handler: () => void;
};

interface MetricFilterButtonProps {
  buttonText: string;
  actions: ActionType[];
  // filters: Record<string, boolean>;
  // setFilters: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const MetricFilterButton: React.FC<MetricFilterButtonProps> = ({ buttonText, actions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState<{
    [key: string]: boolean;
  }>({});
  const [filters, setFilters] = useState({
    cpuPerc: true,
    memUsage: true,
    memPerc: true,
    netIO: true,
    blockIO: true,
    PID: true,
  });

  const toggleModal = () => {
    console.log("opening modal:", !isOpen);
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset selections when opening
      setSelectedActions({});
    }
  };

  const handleCheckboxChange = (label: string) => {
    const key = label.toLowerCase().replace(/[^a-z]/g, ""); // normalize keys like "MEMORY USAGE" -> "memoryusage"
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = () => {
    // Execute all selected actions
    actions.forEach((action) => {
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
              <button className={styles["close-button"]} onClick={toggleModal}>
                ×
              </button>
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
              <button
                className={styles["submit-button"]}
                onClick={handleSubmit}
              >
                Apply Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricFilterButton;
