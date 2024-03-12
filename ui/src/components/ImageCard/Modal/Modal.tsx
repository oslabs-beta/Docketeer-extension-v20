import React, { useEffect, useRef } from "react";
import styles from "./Modal.module.scss";
import { useAppSelector } from "../../../reducers/hooks";
import { GrypeScan } from "../../../../../backend/backend-types";

interface ModalProps {
  trigger: boolean; // Change Boolean to boolean
  setTrigger: (value: boolean) => void;
  index: number;
}

const Modal = ({
  trigger,
  setTrigger,
  index,
}: ModalProps): React.JSX.Element => {
  // get an Object with 5 levels
  /* EverythingObj {
      critical: GrypeScan[];
      high: GrypeScan[];
      medium: GrypeScan[];
      low: GrypeScan[];
      negligible: GrypeScan[];
    }
  */
  const everythingFromStore =
    useAppSelector((state) => state.images.imagesList[index].Everything) ||
    false;

  const everythingName =
    useAppSelector((state) => state.images.imagesList[index].ScanName) || false;
  console.log(`${everythingName} card: ${JSON.stringify(everythingFromStore)}`);

  // closes the Modal when you click outside it

  const modalRef = useRef<HTMLDivElement>(null);

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

  // const entries = [
  //   ["critical", []],
  //   ["high", [{ Package: "stdlib", Version Installed: "go1.21.4", Vulnerability ID: "CVE-2023-45285", Severity: "High" }]],
  //   ["medium", [{ Package: "busybox", Version Installed: "1.36.1", Vulnerability ID: "CVE-2023-42366", Severity: "Medium" },
  //   { Package: "busybox", Version Installed: "1.36.1", Vulnerability ID: "CVE-2023-42365", Severity: "Medium" },
  //   { Package: "busybox", Version Installed: "1.36.1", Vulnerability ID: "CVE-2023-42363", Severity: "Medium" },
  //   { Package: "busybox", Version Installed: "1.36.1", Vulnerability ID: "CVE-2023-42364", Severity: "Medium" },
  //   { Package: "golang.org/x/crypto", Version Installed: "v0.14.0", Vulnerability ID: "GHSA-45x7-px36-x8w8", Severity: "Medium" },
  //   { Package: "stdlib", Version Installed: "go1.21.4", Vulnerability ID: "CVE-2023-39326", Severity: "Medium" }]],
  //   ["low", []],
  //   ["negligible", []]
  // ]

  const entries = Object.entries(everythingFromStore);

  // const result: React.JSX.Element[] = entries.map((innerArray) => {
  //   return (
  //     <div>
  //       <h2>{innerArray[0]}</h2>
  //       <ol>
  //         {(innerArray[1] as any[]).length > 0 ? (
  //           (innerArray[1] as any[]).map(
  //             (Inner2ndElementObj, innerArrayIndex) => {
  //               return (
	// 								<div key={innerArrayIndex}>
	// 									<li>Package: {Inner2ndElementObj.Package}</li>
	// 									<p>
	// 										Version Installed:{' '}
	// 										{Inner2ndElementObj['Version Installed']}
	// 									</p>
	// 									<p>
	// 										Vulnerability ID: {Inner2ndElementObj['Vulnerability ID']}
	// 									</p>
	// 									<br />
	// 								</div>
	// 							);
  //             }
  //           )
  //         ) : (
  //           <p>Nothing to show!</p>
  //         )}
  //       </ol>
  //     </div>
  //   );
  // });

  const result: React.JSX.Element[] = entries.map((innerArray) => {
  const options = (innerArray[1] as any[]).map((Inner2ndElementObj, innerArrayIndex) => (
    <option key={innerArrayIndex} style={{ color: 'blue' }}>
      Package: <span style={{ color: 'red' }}>{Inner2ndElementObj.Package}</span>, Version Installed: <span style={{ color: 'green' }}>{Inner2ndElementObj["Version Installed"]}</span>, Vulnerability ID: <span style={{ color: 'orange' }}>{Inner2ndElementObj["Vulnerability ID"]}</span>
    </option>
  ));

  return (
    <div key={innerArray[0]}>
      <h2>{innerArray[0]}</h2>
      <select>
        {options.length > 0 ? options : <option>Nothing to show!</option>}
      </select>
    </div>
  );
});

  return trigger ? ( // if trigger true popup!
    <div className={styles.popup} ref={modalRef}>
      <div className={styles.popupInner}>
        <h2 className={styles.popuptitle}>{everythingName}</h2>
        {result}
        {/* close button */}
        <button className={styles.closeBtn} onClick={() => setTrigger(false)}>
          x
        </button>
      </div>
      </div>
  ) : (
    // else return nothing
    <></>
  );
};

export default Modal;