import React from "react";
import styles from './Modal.module.scss';
import { useAppSelector } from '../../../reducers/hooks';
import { GrypeScan } from "../../../../../backend/backend-types";

interface ModalProps {
  trigger: boolean; // Change Boolean to boolean
  setTrigger: (value: boolean) => void;
  index: number;
}

const Modal = ({ trigger, setTrigger, index }: ModalProps): React.JSX.Element => {
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

  /* [
      [{ Package: "busybox", Version Installed: "1.36.1", Vulnerability ID: "CVE-2023-42365", Severity: "Medium" }, {}, {}],
      [{ Package: "busybox", Version Installed: "1.36.1", Vulnerability ID: "CVE-2023-42365", Severity: "Medium" }]
     ]
    /*

    Entries
[

]
*/
  // const levels: string[] = ["Critical", "High", "Medium", "Low", "Negligible"];
  // const bigArr: [][] = Object.values(everythingFromStore);

  // console.log('BIGARR: ', bigArr);
  // const printEverything: React.JSX.Element[] = bigArr.map((el, i) => {
  //   return (
  //     <>
  //       <p>{levels[i]}</p>
  //       {el.length !== 0 ? el.map((item) => {
  //         return (
  //           <div>
  //             <p>{item.Package}</p>
  //             <ol>
  //               <li>{item["Version Installed"]}</li>
  //               <li>{item["Vulnerability ID"]}</li>
  //             </ol>
  //           </div>
  //         );
  //       }): <p>Nothing to show!</p>}
  //     </>
  //   );
  // });




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

  const result: React.JSX.Element[] = entries.map((innerArray) => {
    return (
      <div>
        <h2>{innerArray[0]}</h2>
        <ol>
          {(innerArray[1] as any[]).length > 0 ? (

            (innerArray[1] as any[]).map(
              (Inner2ndElementObj, innerArrayIndex) => {
                return (
                  <>
                    <li>Package: {Inner2ndElementObj.Package}</li>
                    <p>
                      Version Installed:{" "}
                      {Inner2ndElementObj["Version Installed"]}
                    </p>
                    <p>Vulnerability ID: {Inner2ndElementObj["Vulnerability ID"]}</p>
                    <br/>
                  </>
                );
              }
              )

          ) : (
            <p>Nothing to show!</p>
          )}
        </ol>
      </div>
    );
  });



  return trigger ? ( // if trigger true popup!
    <div className={styles.popup}>
      <div className={styles.popupInner}>
        <h2 className={styles.popuptitle}>{everythingName}</h2>
        {/* list out */}
        {/* {printEverything} */}
        {result }
        {/* close button */}
        <button className={styles.closeBtn} onClick={() => setTrigger(false)}>
          Close
        </button>
      </div>
    </div>
  ) : (
    <></>
  ); // else return nothing
};

export default Modal;





/*

const entries = Object.entries(everythingFromStore);

const result = entires.map((innerArray, index) => {
  return (<div>
      <h2>{innerArray[0]</h2>
      <ol>
      innerArray[1].map((Inner2ndElementArray, innerArrayIndex) => {
        return <li>
          Package: Inner2ndElementArray.Package
        </li>
        <li>
          Package: Inner2ndElementArray["Version Installed"]
        </li>
        <li>
          Package: Inner2ndElementArray["Vulnerability ID"]
        </li>
        <li>
          Package: Inner2ndElementArray.Severity
        </li>
      })
      </ol>
    </div>
    )
})

const entries = [
 ["critical",[]],
 ["high", [{ Package: "stdlib", Version Installed: "go1.21.4", Vulnerability ID: "CVE-2023-45285", Severity: "High" }]],
 ["medium", [{ Package: "busybox", Version Installed: "1.36.1", Vulnerability ID: "CVE-2023-42366", Severity: "Medium" },
    { Package: "busybox", Version Installed: "1.36.1", Vulnerability ID: "CVE-2023-42365", Severity: "Medium" },
    { Package: "busybox", Version Installed: "1.36.1", Vulnerability ID: "CVE-2023-42363", Severity: "Medium" },
    { Package: "busybox", Version Installed: "1.36.1", Vulnerability ID: "CVE-2023-42364", Severity: "Medium" },
    { Package: "golang.org/x/crypto", Version Installed: "v0.14.0", Vulnerability ID: "GHSA-45x7-px36-x8w8", Severity: "Medium" },
    { Package: "stdlib", Version Installed: "go1.21.4", Vulnerability ID: "CVE-2023-39326", Severity: "Medium" }]],
 ["low", []],
 ["negligible", []]
]
*/