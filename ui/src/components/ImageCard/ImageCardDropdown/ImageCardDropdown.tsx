
import React from 'react';
import styles from '../ImageCard.module.scss';
import { useAppSelector } from '../../../reducers/hooks';

function ImageCardDropdown({ severity, scanName, index }) {

	let top3ObjFromStore =
		useAppSelector((state) => state.images.imagesList[index].Top3Obj) ||
		false;

	console.log(`TOP3 FROM STORE ${scanName}: ${JSON.stringify(top3ObjFromStore)}`);
  
  
  return (
    <div className={styles.dropDown} id={`test${index}`}>
      <div className={styles.dropDownText}>
        <p>{severity}</p>
        {top3ObjFromStore && top3ObjFromStore[severity].length !== 0 ? (
          top3ObjFromStore[severity].map((el: [string, number], i: number) => {
            return <p key={i}>{`${i + 1}. Package Name: ${el[0]} - (${el[1]})`}</p>;
          })
        ) : (
          <p>No vulnerabilites found!</p>
        )}
      </div>
    </div>
  )
}

export default ImageCardDropdown;