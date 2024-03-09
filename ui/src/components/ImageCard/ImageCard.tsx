import React, { SetStateAction, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
import globalStyles from '../global.module.scss';
import styles from './ImageCard.module.scss';
import { ImageCardProps } from '../../../../types';
import {
  VulnerabilityPayload,
  ScanObject,
  ScanReturn,
} from '../../../ui-types';
import { GrypeScan } from '../../../../backend/backend-types';

import Client from '../../models/Client';
import { updateVulnerabilities } from '../../reducers/imageReducer';
import DeleteIcon from '../../../assets/delete_outline_white_24dp.svg';
import PlayIcon from '../../../assets/play_arrow_white_24dp.svg';
import { every } from 'd3';
// import {}


/**
 * @module | ImageCard.tsx
 * @description | new components for images dashboard
 **/

const ImageCard = ({
  imgObj,
  runImageAlert,
  removeImageAlert,
  index,
}: ImageCardProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const [done, setDone] = useState<Boolean>(false);
  // let critical, high, medium, low, negligible;
  let criticalTop3, highTop3, mediumTop3, lowTop3, negligibleTop3;

  const [criticalState, setCritical] = useState<[string,number][]>([]);
  const [highState, setHigh] = useState<[string,number][]>([]);
  const [mediumState, setMedium] = useState<[string,number][]>([]);
  const [lowState, setLow] = useState<[string,number][]>([]);
  const [negligibleState, setNeg] = useState<[string,number][]>([]);


  // const [top3, setTop3] = useState<{
  // criticalTop3: [string, number][];
  // highTop3: [string, number][];
  // mediumTop3: [string, number][];
  // lowTop3: [string, number][];
  // negligibleTop3: [string, number][];
  // }>({
  //   criticalTop3 : [],
  //   highTop3 : [],
  //   mediumTop3 : [],
  //   lowTop3 : [],
  //   negligibleTop3 : [],
  // });

  // get vulnerabilities directly from the store
  let vulnerabilities =
    useAppSelector((state) => state.images.imagesList[index].Vulnerabilities) ||
    false;

  const getScan = async (scanName: string) => {
    try {
      // retrieve scan data - Client.ImageService.getScan creates DDClient Request
      const scanObjectReturn: ScanReturn = await Client.ImageService.getScan(
        scanName
      );
      const vulnerabilityObj: ScanObject = scanObjectReturn.vulnerabilites;
      if (!done) setDone(true);

      console.log('scanObjectReturn JSON FOR GRYPE: ', scanObjectReturn);
      console.log(`Success from getScan: ${scanName}`, vulnerabilityObj);

      // get the info from 5 levels
      // [{ Package: "busybox", Severity: "Medium", Version Installed: "1.36.1", Vulnerability ID: "CVE..." }]
      const everything: GrypeScan[] = scanObjectReturn.everything;
      const critical = everything.filter((el) => el.Severity === 'Critical');
      const high = everything.filter((el) => el.Severity === 'High');
      const medium = everything.filter((el) => el.Severity === 'Medium');
      const low = everything.filter((el) => el.Severity === 'Low');
      const negligible = everything.filter((el) => el.Severity === 'Negligible');

      /* Get top 3 in an obj
         {"busybox": count 
          "crytpo": count, 
          "notbusybox": count } (5)
       */

      const top3Info = (levelArray: GrypeScan[]) => {
        const levelObj = {};
        levelArray.forEach((el) => {
          levelObj[el.Package] = (levelObj[el.Package] || 0) + 1;
        });
        const entries: [string, number][] = Object.entries(levelObj);
        const sortedEntries = entries.sort((a, b) => b[1] - a[1]);
        const top3Entries = sortedEntries.slice(0, 3);
        console.log("top3Entries inside func: ", top3Entries);
        return top3Entries;
      };
      //[[],[], []]
      criticalTop3 = top3Info(critical);
      highTop3 = top3Info(high);
      mediumTop3 = top3Info(medium);
      lowTop3 = top3Info(low);
      negligibleTop3 = top3Info(negligible);
      console.log('TOP 3 - CRITICAL: ', criticalTop3);
      console.log('TOP 3 - HIGH: ', highTop3);
      console.log('TOP 3 - MEDIUM: ', mediumTop3);
      console.log('TOP 3 - LOW: ', lowTop3);
      console.log('TOP 3 - NEGLIGIBLE: ', negligibleTop3);

      setCritical(criticalTop3);
      setHigh(highTop3);
      setMedium(mediumTop3);
      setLow(lowTop3);
      setNeg(negligibleTop3);
       console.log('CRIT STATE: ', criticalState);
       console.log('HIGH STATE: ', highState);
       console.log('MED STATE: ', mediumState);
       console.log('LOW STATE: ', lowState);
       console.log('NEG STATE: ', negligibleState);

      // setTop3((prevState) => {...prevState, criticalTop3: criticalTop3 });
      // setTop3((prevState) => {...prevState, highTop3 });
      // setTop3((prevState) => {...prevState, mediumTop3 });
      // setTop3((prevState) => {...prevState, lowTop3 });
      // setTop3((prevState) => {...prevState, negligibleTop3 });

      // if the image failed to be scanned for vulnerabilities, update the image card state to have a default vulnerability object
      if (vulnerabilityObj === undefined) {
        const defaultVul: VulnerabilityPayload = {
          vulnerabilityObj: { Critical: '-', High: '-', Medium: '-', Low: '-' },
          scanName: scanName,
        };
        dispatch(updateVulnerabilities(defaultVul));
        return;
      }

      // create an object of type VulnerabilityPayload with the returned vulnerability object and the scanName
      const updateVul: VulnerabilityPayload = { vulnerabilityObj, scanName };
      // dispatch VulnerabilityPayload to update the imgObj in the store with the vulnerability info
      dispatch(updateVulnerabilities(updateVul));
      console.log('after reducuer invoked', imgObj);
      return;
    } catch (error) {
      // Log error if failed
      console.log('getScan has failed to get vulnerabilities: ', error);
    }
  };

  // DROPDOWN INFO CARD
  const [dropDown, setDropDown] = useState({
    critical: false,
    high: false,
    medium: false,
    low: false,
    negligible: false,
  });
  const toggleDropdown = (criticalType: string) => {
    setDropDown((prevState) => {
      // toggle true/false for that criticalType
      prevState[criticalType] = prevState[criticalType] ? false : true;
      // Change OTHER key to false
      for (let key in prevState) {
        prevState[key] = key !== criticalType ? false : prevState[key];
      }
      return { ...prevState };
    });
  };

  // call getScan upon render for each card
  useEffect(() => {
    if (!vulnerabilities) getScan(imgObj.ScanName);
    else setDone(true); // keep the green check
  }, []);

  return (
    <div
      className={
        done && Object.keys(vulnerabilities).length === 4
          ? styles.imageCardCrit
          : done && Object.keys(vulnerabilities).length === 3
          ? styles.imageCardHigh
          : done && Object.keys(vulnerabilities).length === 2
          ? styles.imageCardMed
          : done && Object.keys(vulnerabilities).length === 1
          ? styles.imageCardLow
          : done && Object.keys(vulnerabilities).length === 0
          ? styles.imageCardDone
          : styles.imageCard
      }>
      {/* vulnerability info card changing border color based on level found */}
      <div className={styles.imageInfo}>
        {/* image scanName: LEFT SIDE */}
        <div>
          <p className={styles.ImageName}>{imgObj['Repository']}</p>
          <p className={styles.ImageTag}>{imgObj['Tag']}</p>
        </div>
        {/* VULNERABILITY */}
        <div className={styles.VulnerabilitiesBlock}>
          {/* <p className={styles.VulnerabilitiesTitle}>Vulnerabilities</p> */}
          <div className={styles.imageVulnerabilities}>
            <div className={styles.imgVulDiv}>
              <p
                onClick={() => toggleDropdown('critical')}
                className={`${
                  vulnerabilities.Critical
                    ? styles.critical
                    : done
                    ? styles.green
                    : styles.grayOut
                }`}>
                {vulnerabilities.Critical && (
                  <span className={styles.vulNum}>
                    {vulnerabilities.Critical ? vulnerabilities.Critical : ''}
                  </span>
                )}{' '}
                C
              </p>
            </div>
            <div className={styles.imgVulDiv}>
              <p
                onClick={() => toggleDropdown('high')}
                className={`${
                  vulnerabilities.High
                    ? styles.high
                    : done
                    ? styles.green
                    : styles.grayOut
                }`}>
                {vulnerabilities.High && (
                  <span className={styles.vulNum}>{vulnerabilities.High}</span>
                )}{' '}
                H
              </p>
            </div>
            <div className={styles.imgVulDiv}>
              <p
                onClick={() => toggleDropdown('medium')}
                className={`${
                  vulnerabilities.Medium
                    ? styles.medium
                    : done
                    ? styles.green
                    : styles.grayOut
                }`}>
                {vulnerabilities.Medium && (
                  <span className={styles.vulNum}>
                    {vulnerabilities.Medium}
                  </span>
                )}{' '}
                M
              </p>
            </div>
            <div className={styles.imgVulDiv}>
              <p
                onClick={() => toggleDropdown('low')}
                className={`${
                  vulnerabilities.Low
                    ? styles.low
                    : done
                    ? styles.green
                    : styles.grayOut
                }`}>
                {vulnerabilities.Low && (
                  <span className={styles.vulNum}>{vulnerabilities.Low}</span>
                )}{' '}
                L
              </p>
            </div>
            {/* Test Negligible */}
            <div className={styles.imgVulDiv}>
              <p
                onClick={() => toggleDropdown('negligible')}
                className={`${
                  vulnerabilities.Negligible
                    ? styles.negligible
                    : done
                    ? styles.green
                    : styles.grayOut
                }`}>
                {vulnerabilities.Negligible && (
                  <span className={styles.vulNum}>
                    {vulnerabilities.Negligible}
                  </span>
                )}{' '}
                N
              </p>
            </div>
          </div>
          {/* toggler drop down info of vulnerability type clicked */}
          {dropDown.critical && (
            <div className={styles.dropDown} id={`test${index}`}>
              <div className={styles.dropDownText}>
                {criticalState ? (
                  criticalState.map((el: [string, number], i: number) => {
                    return <p>{`${i + 1}. ${el[0]} - ${el[1]}`}</p>;
                  })
                ) : (
                  <p>You're Safe!</p>
                )}
              </div>
            </div>
          )}
          {dropDown.high && (
            <div className={styles.dropDown} id={`test${index}`}>
              <div className={styles.dropDownText}>
                {highState ? (
                  highState.map((el: [string, number], i: number) => {
                    return <p>{`${i + 1}. ${el[0]} - ${el[1]}`}</p>;
                  })
                ) : (
                  <p>You're Safe!</p>
                )}
              </div>
            </div>
          )}
          {dropDown.medium && (
            <div className={styles.dropDown} id={`test${index}`}>
              <div className={styles.dropDownText}>
                {mediumState ? (
                  mediumState.map((el: [string, number], i: number) => {
                    return <p>{`${i + 1}. ${el[0]} - ${el[1]}`}</p>;
                  })
                ) : (
                  <p>You're Safe!</p>
                )}
              </div>
            </div>
          )}
          {dropDown.low && (
            <div className={styles.dropDown} id={`test${index}`}>
              <div className={styles.dropDownText}>
                {lowState ? (
                  lowState.map((el: [string, number], i: number) => {
                    return <p>{`${i + 1}. ${el[0]} - ${el[1]}`}</p>;
                  })
                ) : (
                  <p>You're Safe!</p>
                )}
              </div>
            </div>
          )}
          {dropDown.negligible && (
            <div className={styles.dropDown} id={`test${index}`}>
              <div className={styles.dropDownText}>
                {negligibleState ? (
                  negligibleState.map((el: [string, number], i: number) => {
                    return <p>{`${i + 1}. ${el[0]} - ${el[1]}`}</p>;
                  })
                ) : (
                  <p>You're Safe!</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* RUN / REMOVE */}
      <div className={styles.buttons}>
        <img
          src={PlayIcon}
          className={styles.imgCardButton}
          onClick={() => runImageAlert(imgObj)}></img>
        <img
          src={DeleteIcon}
          className={styles.imgCardButton}
          onClick={() => removeImageAlert(imgObj)}></img>
      </div>
    </div>
  );
};

export default ImageCard;

/*

Code for Modal - ImageCard.tsx file

const [modalOpen, setModalOpen] = useState(false);
const [modalContent, setModalContent] = useState('');


  const openModal = (content: string) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  
  For ImageCard.tsx file return:

  {Object.keys(dropDown).map((type) => (
     <div key={type} className={styles.imgVulDiv}>
        <p
           onClick={() => toggleDropdown(type)}
           className={`${vulnerabilities[type] ? styles[type] : done ? styles.green : styles.grayOut}`}>
           {vulnerabilities[type] && (
           <span className={styles.vulNum}>{vulnerabilities[type]}</span>
           )}{' '}
            {type.charAt(0).toUpperCase()}
            {dropDown[type] ? " (See Less)" : " (See More)"}
         </p>
                {dropDown[type] && (
                  <div className={styles.dropDown} id={`test${index}`}>
                    <p className={styles.dropDownText}>{type.charAt(0).toUpperCase() + type.slice(1)}</p>
                    <button onClick={() => openModal(type)} className="see-more-button">See More</button>
                  </div>
                )}

  </div>

   */