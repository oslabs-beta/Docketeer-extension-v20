
import React, {useState} from 'react';
import styles from './ImageCardDropdown.module.scss';
import { useAppDispatch, useAppSelector } from '../../../reducers/hooks';
import Modal from '../Modal/Modal';
import { constants } from 'os';

interface ImageCardDropdownProps {
  severity: string;
  scanName: string;
  index: number;
}

const ImageCardDropdown = ({ severity, scanName, index }: ImageCardDropdownProps): React.JSX.Element => {
  // state for modal popup
  const [modalToggler, setModalToggler] = useState(false);
	const dispatch = useAppDispatch();

  const capitalString = severity[0].toUpperCase() + severity.slice(1);
	const top3ObjFromStore =
    useAppSelector((state) => state.images.imagesList[index].Top3Obj) || false;
  // console.log(`TOP3 FROM STORE ${scanName}: ${JSON.stringify(top3ObjFromStore)}`);

  return (
    <>
      <div className={styles.dropDown} id={`test${index}`}>
        {top3ObjFromStore && top3ObjFromStore[severity].length !== 0 ? (
          <div>
            <p
              style={{
                textAlign: "center",
              }}
            >{`Top 3 ${capitalString} Packages (count)`}</p>
            <div style={{ marginRight: "135px" }}>
              {top3ObjFromStore[severity].map(
                (el: [string, number], i: number) => {
                  return (
                    <p key={i}>
                      {`${i + 1}. Package: `}
                      <span
                        style={{
                          color: "#89CFF0",
                        }}
                      >{`${el[0]}`}</span>
                      {` (${el[1]})`}
                    </p>
                  );
                }
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
            style={{
              textAlign: "center",
            }}
          >{`No ${capitalString} Vulnerabilites Detected!`}</p>
        )}
      </div>
      {/* PopUp for Learn More */}
      <Modal trigger={modalToggler} setTrigger={setModalToggler} index={index} />
    </>
  );
}

export default ImageCardDropdown;