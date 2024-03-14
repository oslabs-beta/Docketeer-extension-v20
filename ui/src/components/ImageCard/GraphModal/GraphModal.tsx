import React, { useEffect, useRef, useState } from 'react';
import styles from './GraphModal.module.scss';
import { useAppSelector } from '../../../reducers/hooks';
import Client from '../../../models/Client';
import { ScanObject } from "../../../../ui-types";

import { ResponsivePie } from "@nivo/pie";
import { MyResponsivePie } from "./PieChart";

interface GraphModalProps {
  trigger: boolean;
  setTrigger: (value: boolean) => void;
  index: number;
}

const GraphModal = ({
  trigger,
  setTrigger,
  index,
}: GraphModalProps): React.JSX.Element => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  const scanName =
    useAppSelector((state) => state.images.imagesList[index].ScanName) || false;

  const vulList: ScanObject =
    useAppSelector((state) => state.images.imagesList[index].Vulnerabilities) ||
    false;
  const levels: string[] = ["Critical", "High", "Medium", "Low", "Negligible"];
  const data = [];

  levels.forEach((el, i) => {
    const dataPoint = {
      id: el,
      label: el,
      value: vulList[i] ? vulList[i] : 0,
      color:
        i === 0
          ? "hsl(48, 70%, 50%)"
          : i === 1
          ? "hsl(62, 70%, 50%)"
          : i === 2
          ? "hsl(102, 70%, 50%)"
          : i === 3
          ? "hsl(38, 70%, 50%)"
          : "hsl(354, 70%, 50%)",
    };
    // Push the data point to the data array
    data.push(dataPoint);
  });
  console.log("DATA: ", data);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setTrigger(false);
    }
  };

  useEffect(() => {
    if (trigger) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [trigger, setTrigger]);

  return trigger ? (
    <div className={styles.popup} ref={modalRef}>
      <div className={styles.popupInner}>
        <div className={styles.header}>
          <h2 className={styles.popuptitle}>{scanName}</h2>
          {/* close button */}
          <button className={styles.closeBtn} onClick={() => setTrigger(false)}>
            x
          </button>
        </div>
        {/* PIE CHART HERE */}
        {/* <MyResponsivePie data={data} /> */}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default GraphModal;




