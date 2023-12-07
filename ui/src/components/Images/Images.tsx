import React, { SyntheticEvent, useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../reducers/hooks';
import { createAlert, createPrompt } from '../../reducers/alertReducer';
import styles from './Images.module.scss';
import globalStyles from '../global.module.scss';
import { ImageType } from 'types';
import { fetchImages } from '../../reducers/imageReducer';
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

// export interface TestParams {
//   imagesListTest?: ImageType[];
// }
// ---------------------------------------------

const Images = (params?: TestParams): React.JSX.Element => {
  console.log('Running images function');
  const reduxImagesList = useAppSelector((state) => state.images.imagesList);
  const imagesList: ImageType[] = params.imagesListTest ? params.imagesListTest : reduxImagesList;

  // const [imagesList, setImagesList] = useState(reduxImagesList);
  
  const dispatch = useAppDispatch();
  
    useEffect(() => {
      // async function updateImages() {
        dispatch(fetchImages());
      // }
      // updateImages()
      console.log('imageList in fetch: ', imagesList)
      // imagesList.forEach((image) => {
      //   getScan(image.ScanName)
      // });
    }, []);
  
  // useEffect((): void => {
  //   imagesList.forEach((image) => {
  //     image.Vulnerabilities = getScan(image.ScanName)
  //   })
  //   // setImagesList(imagesList)
  // }, [])

  // 
  // localhost:4000/api/docker/image/scan (POST REQUEST BODY: {scanName: imageName + tab})
  // scanName 

  const runImage = async (image: ImageType) => {
    const success = await Client.ImageService.runImage(
      image.Repository,
      image.Tag
    );
    if (success) dispatch(fetchImages());
  };

  const removeImage = async (imageId: string) => {
    const success = await Client.ImageService.removeImage(imageId);
    if (success) dispatch(fetchImages());
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

  // Scan Vulnerability Function: Use individual ScanName of each image
  // const getScan = async (scanName: string) => { 
  //   const success = await Client.ImageService.getScan(scanName);
  //   console.log(`Success from getScan: ${scanName}`, success);
    
  //   return success;
  // }


  // mock images data
  // const imagesList = [
  //   { 'Repository': 'ducketeer', 'Critical': 10, 'High': 10, 'Med': 15, 'Low': 5 },
  //   { 'Repository': 'kirby-db', 'Critical': 2, 'High': 20, 'Med': 30, 'Low': 15 },
  //   { 'Repository': 'banana', 'Critical': 4, 'High': 2, 'Med': 10, 'Low': 5 }
  // ];

  console.log('images list: ', imagesList);

  const renderedImages: React.JSX.Element[] = [];

  for(let i = 0; i < imagesList.length; i++) {
    renderedImages.push(<ImageCard removeImageAlert={removeImageAlert} runImageAlert={runImageAlert} key={i} imgObj={imagesList[i]}/>)
  }

  return (
    <div>
    
      {/* VULNERABILITY SUMMARY INFO */}
      <div>
        <ImagesSummary/>
      </div>

      {/* IMAGE CARDS */}
      <div>
        {renderedImages}
      </div>
    
    </div>

    // <div className={styles.wrapper}>
    //   <div className={styles.availableImagesHolder}>
    //     <h2>AVAILABLE IMAGES</h2>
    //     <div className={styles.imageHolder}>
    //       {imagesList.map((image, i: number) => {
    //         return (
    //           <div key={`image-${i}`} className={styles.imageCard}>
    //             <div className={styles.textHolder}>
    //               <figure>
    //                 <img
    //                   className={styles.image}
    //                   src={`https://d36jcksde1wxzq.cloudfront.net/54e48877dab8df8f92cd.png`}
    //                 />
    //               </figure>
    //               <div>
    //                 <h2>{image.Repository}</h2>
    //                 <p>{image.Tag}</p>
    //                 <p>{`Image ID: ${image.ID}`}</p>
    //                 <p>{`Image Size: ${image.Size}`}</p>
    //               </div>
    //               <div className={styles.buttonHolder}>
    //                 <div className={styles.buttonSpacer}>
    //                   <button
    //                     role="button"
    //                     name="RUN"
    //                     className={globalStyles.buttonSmall}
    //                     onClick={() => runImageAlert(image)}
    //                   >
    //                     RUN
    //                   </button>
    //                   <button
    //                     role="button"
    //                     name="REMOVE"
    //                     className={globalStyles.buttonSmall}
    //                     onClick={() => removeImageAlert(image)}
    //                   >
    //                     REMOVE
    //                   </button>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         );
    //       })}
    //     </div>
    //   </div>
    // </div>
  );
};

export default Images;
