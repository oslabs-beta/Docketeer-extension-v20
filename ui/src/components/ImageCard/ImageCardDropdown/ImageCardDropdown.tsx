import React, { useState } from 'react';
import styles from './ImageCardDropdown.module.scss';
import { useAppDispatch, useAppSelector } from '../../../reducers/hooks';
import InfoModal from '../InfoModal/InfoModal';
import { constants } from 'os';

interface ImageCardDropdownProps {
	severity: string;
	scanName: string;
	index: number;
	modalToggler: boolean;
  setModalToggler: (boolean) => void;
  setgraphModal: (boolean) => void;
  setDropDown: (object) => void;
}

const ImageCardDropdown = ({
  severity,
  scanName,
  index,
  modalToggler,
  setModalToggler,
  setgraphModal,
  setDropDown
}: ImageCardDropdownProps): React.JSX.Element => {
  // state for modal popup
  const dispatch = useAppDispatch();

  const capitalString: string = severity[0].toUpperCase() + severity.slice(1);
  const top3ObjFromStore: object | boolean =
    useAppSelector((state) => state.images.imagesList[index].Top3Obj) || false;
  // console.log(`TOP3 FROM STORE ${scanName}: ${JSON.stringify(top3ObjFromStore)}`);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.dropDown} id={`test${index}`}>
          {top3ObjFromStore && top3ObjFromStore[severity].length !== 0 ? (
            <div className={styles.content}>
              <p
                className={styles.centerText}
              >{`Top 3 ${capitalString} Packages (count)`}</p>
              <div className={styles.listContainer}>
                {top3ObjFromStore[severity].map(
                  (el: [string, number], i: number) => (
                    <p key={i}>
                      {`${i + 1}. Package: `}
                      <span className={styles.package}>{`${el[0]}`}</span>
                      {` (${el[1]})`}
                    </p>
                  )
                )}
              </div>
              <p
                className={styles.learnMore}
                onClick={() => setModalToggler(true)}
              >
                Learn More!
              </p>
            </div>
          ) : (
            <p
              className={styles.centerText}
            >{`No ${capitalString} Vulnerabilities Detected!`}</p>
          )}
        </div>
      </div>
      <>
        {modalToggler && <div className={styles.backdrop}></div>}
        {/* PopUp for Learn More */}
        <div className={styles.modalContainer}>
          <InfoModal
            trigger={modalToggler}
            setTrigger={setModalToggler}
            index={index}
            severity={severity}
            setgraphModal={setgraphModal}
            setDropDown={setDropDown}
          />
        </div>
      </>
    </>
  );
};

export default ImageCardDropdown;
