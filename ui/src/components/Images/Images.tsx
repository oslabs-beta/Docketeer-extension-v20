import React, { SetStateAction, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../reducers/hooks';
import { createAlert, createPrompt } from '../../reducers/alertReducer';
import styles from './Images.module.scss';
import { ImageType } from '../../../../types';
import { fetchImages, deleteImage } from '../../reducers/imageReducer';
import Client from '../../models/Client';
import ImageCard from '../ImageCard/ImageCard';
import ImagesSummary from '../ImagesSummary/ImagesSummary';
import { resetImageProperties } from "../../reducers/imageReducer";

/**
 * @module | Images.tsx
 * @description | Provides ability to pull images from DockerHub image repository, run images, and remove images
 **/

const Images = (): React.JSX.Element => {
  console.log('Rendering Images component');
  const [scanDone, setScanDone] = useState<boolean>(false);
  const [time, setTime] = useState<string>('');
  const [reset, setReset] = useState<boolean>(false);
  const imagesList: ImageType[] = useAppSelector((state) => state.images.imagesList);

  const dispatch = useAppDispatch();

  // If imagesList is not populated, send a dispatch that will fetch the list of docker images from the backend
  useEffect(() => {
    if (!imagesList.length) {
      dispatch(fetchImages());
    }
  }, []);

  const runImage = async (image: ImageType) => {
    const success = await Client.ImageService.runImage(
      image.Repository,
      image.Tag
    );
    if (success) dispatch(fetchImages());
  };

  const removeImage = async (imageId: string) => {
    const success = await Client.ImageService.removeImage(imageId);
    if (success) {
      dispatch(deleteImage(imageId))
    };
  };

  const runImageAlert = (imgObj: ImageType) => {
    dispatch(
      createPrompt(
        `Are you sure you want to run ${imgObj.Repository}?`,
        () => {
          runImage(imgObj);
          dispatch(
            createAlert(`Running ${imgObj.Repository}...`, 2, "success")
          );
        },
        () => {
          dispatch(
            createAlert(
              `The request to run ${imgObj.Repository} has been cancelled.`,
              2,
              "warning"
            )
          );
        }
      )
    );
  };

  const removeImageAlert = (imgObj: ImageType) => {
    dispatch(
      createPrompt(
        `Are you sure you want to remove ${imgObj.Repository}?`,
        () => {
          removeImage(imgObj.ID);
          dispatch(
            createAlert(`Removing ${imgObj.Repository}...`, 2, "success")
          );
        },
        () => {
          dispatch(
            createAlert(
              `The request to remove ${imgObj.Repository} has been cancelled.`,
              2,
              "warning"
            )
          );
        }
      )
    );
  };

  // imagesList = [ {image1}, {image2, ScanName: whatever, Vulnerabilties: {high, med, low, critical:}}, {image3}]
  // declare a constant array of elements and push an image card into this array for each image in the imagesList
  let renderedImages: React.JSX.Element[] = imagesList.map((imageObj, i) => (
    <ImageCard
      removeImageAlert={removeImageAlert}
      runImageAlert={runImageAlert}
      key={i}
      index={i} // 1
      imgObj={imageObj} //current image in the imagesList
      setTime={setTime}
      reset={reset}
      setReset={setReset}
    />
  ));

  return (
    <div className={styles.ImagesContainer}>
      <h2 className={styles.VulnerabilitiesTitle}>VULNERABILITIES</h2>
      {/* VULNERABILITY SUMMARY INFO */}
      <div>
        <ImagesSummary scanDone={scanDone} setScanDone={setScanDone} reset={reset} />
      </div>
      <div className={styles.buttonDiv}>
        <button
          className={scanDone ? styles.button : styles.buttonLoad}
          onClick={() => {
            if (scanDone) dispatch(resetImageProperties());
            setReset(true);
          }}
        >
          RESCAN
        </button>
        {/* make Last Scan button conditionally grey or blue */}
        <button className={styles.button}>LAST SCAN</button>
      </div>
      <h2 className={styles.VulnerabilitiesTitle}>
        {`IMAGES - Last Scan: `}
        <span style={{ color: "#9ab4fbc7" }}>{!time ? "" : `(${time})`}</span>
      </h2>
      {/* IMAGE CARDS */}
      <div className={styles.ImagesCardsView}>{renderedImages}</div>
    </div>
  );
};

export default Images;
