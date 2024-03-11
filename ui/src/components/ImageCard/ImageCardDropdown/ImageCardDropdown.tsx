
import React, {useState} from 'react';
import styles from './ImageCardDropdown.module.scss';
import { useAppSelector } from '../../../reducers/hooks';
import Modal from '../Modal/Modal.tsx';

function ImageCardDropdown({ severity, scanName, index }) {
  // state for modal popup
  const [modalToggler, setModalToggler] = useState(false);
  
  const capitalString = severity[0].toUpperCase() + severity.slice(1);
	const top3ObjFromStore =
		useAppSelector((state) => state.images.imagesList[index].Top3Obj) ||
		false;

	console.log(`TOP3 FROM STORE ${scanName}: ${JSON.stringify(top3ObjFromStore)}`);
  
  
  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  
  return (
    <>
      <div className={styles.dropDown} id={`test${index}`}>
        <p style={{ textAlign: 'center' }}>{`Top 3 ${capitalString} Packages (count)`}</p>
        <div style={{ margin: '0 0 0 25px' }}>
          {top3ObjFromStore && top3ObjFromStore[severity].length !== 0 ? (
            top3ObjFromStore[severity].map(
              (el: [string, number], i: number) => {
                return (
                  <p key={i}>
                    {`${i + 1}. Package: `}
                    <span
                      style={{
                        color: '#89CFF0',
                      }}>{`${el[0]} (${el[1]})`}</span>
                  </p>
                );
              }
            )
          ) : (
            <p>No vulnerabilites found!</p>
          )}
        </div>
        {top3ObjFromStore && top3ObjFromStore[severity].length !== 0 ? (
          <p
          className={styles.learnMore}
          onClick={() => setModalToggler(true)}>
          Learn More!
          </p>
        ) : null}
      </div>
      <Modal trigger={modalToggler} setTrigger={setModalToggler} />
    </>
  );
}

export default ImageCardDropdown;