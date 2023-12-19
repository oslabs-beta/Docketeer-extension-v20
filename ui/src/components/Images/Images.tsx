import React, { SetStateAction, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../reducers/hooks';
import { createAlert, createPrompt } from '../../reducers/alertReducer';
import styles from './Images.module.scss';
import { ImageType } from '../../../../types';
import { fetchImages, deleteImage } from '../../reducers/imageReducer';
import Client from '../../models/Client';
import ImageCard from '../ImageCard/ImageCard';
import ImagesSummary from '../ImagesSummary/ImagesSummary';

/**
 * @module | Images.tsx
 * @description | Provides ability to pull images from DockerHub image repository, run images, and remove images
 **/

// ---------------------------------------------
// eslint-disable-next-line react/prop-types
// optional TestParams for testing only

export interface TestParams {
  imagesListTest?: ImageType[];
}
// ---------------------------------------------


const Images = (params?: TestParams): React.JSX.Element => {
  console.log('Running images function');
  const imagesList: ImageType[] = useAppSelector((state) => state.images.imagesList);
  // const imagesList: ImageType[] = params.imagesListTest ? params.imagesListTest : reduxImagesList;
  
  const dispatch = useAppDispatch();
  
  // on initial render, send a dispatch that will fetch the list of docker images from the backend
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
    // if (success) dispatch(fetchImages());
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

  // declare a constant array of elements and push an image card into this array for each image in the imagesList
  let renderedImages: React.JSX.Element[] = [];

  // Populate renderedImages if its empty
  // if (!renderedImages.length) {
      renderedImages = imagesList.map((imageObj, i) => (
        <ImageCard
          removeImageAlert={removeImageAlert}
          runImageAlert={runImageAlert}
          key={i}
          index={i}
          imgObj={imageObj}
        />
      ))
  // } //else {
    // iterate through imagesList
  //   for (let i = 0; i < imagesList.length; i++){
  //     // check if the obj in renderedImages and imagesList have the same vulnerabilities
  //     if (imagesList[i].Vulnerabilities !== renderedImages[i].props.imgObj.Vulnerabilities) {
  //       // setRenderedImages((prev) =>
  //         renderedImages.splice(
  //           i,
  //           1,
  //           <ImageCard
  //             removeImageAlert={removeImageAlert}
  //             runImageAlert={runImageAlert}
  //             key={i}
  //             imgObj={imagesList[i]}
  //           />
  //         )
  //       // );
  //     }
  //   }
  // }

  // for (let i = 0; i < imagesList.length; i++) {
    // If renderedImages === []
    // push all cards

    //If rendered Images already is populated
    // check if the card imgObj.Vulnerabilities is different than imagesList[at that same obj].vulnerabilities
    // 
    // if (imagesList[i].Vulnerabilities) {
      // console.log('ImgObj of the element in Rendered Images: ', renderedImages[i].props.imgObj);
      // renderedImages.push(<ImageCard removeImageAlert={removeImageAlert} runImageAlert={runImageAlert} key={i} imgObj={imagesList[i]} />)
    // }
  // }
  // console.log('Rendered Images: ', renderedImages);
  

  return (
    <div className={styles.ImagesContainer}>
      {/* VULNERABILITY SUMMARY INFO */}
      <div>
        <ImagesSummary/>
      </div>
      {/* IMAGE CARDS */}
      <div className={styles.ImagesCardsView}>
        {renderedImages}
      </div>
    
    </div>
  );
};

export default Images;
