import React, { useEffect, useRef, useState } from 'react';
import styles from './CompareModal.module.scss';
import { useAppSelector } from '../../../reducers/hooks';
import { MongoData } from '../../../../ui-types';
import { ImageType } from '../../../../../types';
import { Chart as ChartJS, Tooltip as ChartToolTip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';
import { Line } from "react-chartjs-2";
import { Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Zoom from '@mui/material/Zoom';
import Client from '../../../models/Client';
import DropDownData from './DropDownData';

/* React-Chartjs-2 doc:
  https://react-chartjs-2.js.org/
	https://www.chartjs.org/docs/latest/
  register globally to render as component!
 */
ChartJS.register(ChartToolTip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

/* React-Select
	Link: https://react-select.com/home#getting-started
	Example: https://codesandbox.io/p/sandbox/react-select-custom-dark-8leq1?file=%2Fsrc%2FApp.js
 */

interface CompareModalProps {
  trigger: boolean;
  setTrigger: (value: boolean) => void;
}

const CompareModal = ({
  trigger,
  setTrigger,
}: CompareModalProps): React.JSX.Element => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [historyData, setHistoryData] = useState<MongoData[]>([]);
  const [time, setTime] = useState<string[]>([]);
  // selected
  const [selectedTime, setSelectedTime] = useState<[]>([]);

	
  // get all the MongoDB data
  const getHistory = async (): Promise<void> => {
    try {
      const mongoData: MongoData[] = await Client.ImageService.getHistory();
      console.log("MONGODATA: ", mongoData);
			
      setHistoryData(mongoData);
      setTime(mongoData.map((el) => el.timeStamp));
			
      return;
    } catch (error) {
      // Log error if failed
      console.log("getHistory has failed to get data: ", error);
    }
  };
	
  const handleClickOutside = (event: MouseEvent): void => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setTrigger(false);
    }
  };

  // UPON HISTORY MODAL STATE CHANGE
  useEffect(() => {
    if (trigger) {
      // document.addEventListener('mousedown', handleClickOutside);
      getHistory();
    }
    return () => {
      // document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [trigger, setTrigger]);

  // logic to map through and get total number for each timestamp


  // config
  const options: object = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 30, // Set the desired font size for the legend labels
          },
          color: "white",
        },
      },
      tooltip: {
      },
    },
  };
	
  // onclick for LATER!
  const onClick = {}

  /* {
    timeStamp:
    imageName:
    vulnerabilitiesCount:
  }
  */

	
  //returns an array of each document's timeStamp, and total vulnerabilty array of each image
  /*
    [
      {
       timeStamp: march 21, 12:19PM, 
       allImageData: [
        {imageName: totalVulnerabitites (NUMBER)}
        {image2: totalVulnerabitites (NUMBER)}
        {image3: totalVulnerabitites (NUMBER)}
       ]
      }, 
      {
       timeStamp: march 25, 3:00PM,
       allImageData:[
        {imageName: totalVulnerabitites (NUMBER)}
        {image2: totalVulnerabitites (NUMBER)}
        {image3: totalVulnerabitites (NUMBER)}
       ]
      }, 
    ]
*/
  const resultData = historyData.map((document) => {

    const timeStamp = document.timeStamp;
    const imagesListArr = document.imagesList;
    
    //access each image obj and return an array of objects each being the image name with a value of total vulnerabilities for each
    //[{Image 1 resultObj}, {Image 2 resultObj}]
    const allImageData = imagesListArr.map((imageObj) => {
      const vulnerabilityArray = Object.values(imageObj.Vulnerabilities); // [33, 31, 1, 20]
      const totalVulnerabilitiesOfImage = vulnerabilityArray.reduce((acc: any, curr: any) => acc + curr, 0); // 85
      const imageName = imageObj.ScanName;
      const resultObj = {
        imageName, //"extension-docketeer:latest"
        ttotalVulnerabilitiesOfImage: totalVulnerabilitiesOfImage //85
      }
      return resultObj;
    })

    const allImageObj = {
      timeStamp,
      allImageData,
    }
  })


/* This is what document stored in Mongodb looks like

	historyData = {
			userIP: string;
			imagesList: [];
			timeStamp: string;
	}

[ 
	{
		userIP: string,
  	imagesList:(7) [
    		{0:
      		Containers: "N/A",
      		CreatedAt: "2024-03-14 19:39:05 +0000 UTC",
      		CreatedSince: "23 hours ago",
      		Digest: "<none>",
      		Everything: {critical: [{Package: 'node', Version Installed: '18.12.1', Vulnerability ID: 'CVE-2023-32002', Severity: 'Critical'}], high: [], medium: [], low: [], negligible: [], …},
      		ID: "98025d5af9a5",
      		Repository: "extension-docketstringeer",
      		ScanName: "extension-docketeer:latest",
      		SharedSize: "N/A",
      		Size: "1.7GB",
      		Tag: "latest",
      		Top3Obj: {critical: [['package', 3]], high: [['package', 13]], medium: [['package', 20]], low: [['package', 4]], negligible: [['package', 1]]},
      		UniqueSize: "N/A",
      		VirtualSize: "1.699GB",
      		Vulnerabilities: {Medium: 33, High: 31, Critical: 1, Unknown: 20},
				},
				{...} ONE IMAGE
   		],
  	timeStamp: 'Last-Scan-Time'
	},
	
	{...} ONE DOCUMENT
]
*/

	const totalVulnerabilities: any[] = historyData.map((document) => {
    const imagesListArr: ImageType[] = document.imagesList;
		return imagesListArr.map(image => { 
			//[33, 31, 1, 20]
			const totalVul: any = Object.values(image.Vulnerabilities).reduce((acc: any, curr: any) => acc + curr, 0);
			console.log('totalVul', totalVul);
			return totalVul;
		});	
	});
	console.log("totalVulnerabilities", totalVulnerabilities);

	const datasetsArr: any[] = totalVulnerabilities.map((card, i) => {
		return {
      label: scanNameArr[i],
      data: card,
      borderColor: "aqua",
      tension: 0.4,
    };
	});
	console.log('DATA SETS ARRAY', datasetsArr);

	
  /*
    [
      {
       timeStamp: march 21, 12:19PM, 
       allImageData:[
        {
					imageName1: , 
					totalVulnerabitites: (NUMBER)
				}
        {
					imageName2: , 
					totalVulnerabitites: (NUMBER)
				}
        {
					imageName3: , 
					totalVulnerabitites: (NUMBER)
				}
       ]
      }, 
      {
       timeStamp: march 25, 3:00PM,
       allImageData:[
        {
					imageName1: , 
					totalVulnerabitites: (NUMBER)
				}
        {
					imageName2: , 
					totalVulnerabitites: (NUMBER)
				}
        {
					imageName3: , 
					totalVulnerabitites: (NUMBER)
				}
       ]
      }
    ]
*/

  //RESULTDATA

  const dataInput = resultData.map((formattedDocument) => {
    // line chart props
    const allImageDataArray = formattedDocument.allImageData;
    const datasetsArray = allImageDataArray.map((imageObj) => {
      

      /*
      allIm{
        imageName, //"extension-docketeer:latest"
        totalVulnerabilitiesOfImage: totalVulnerabilitiesOfImage //85
      }
      */
      
     return {
       label: imageObj.imageName,
				data: 
				borderColor: 'aqua',
				tension: 0.4
      },
    })

  const data: object = {
    // labels: ['A','B','C'], // x-axis label --> timeStamp
    labels: formattedDocument.timeStamp, // x-axis label --> timeStamp
    datasets: datasetsArr,
    /*
    [
      {
        label: scanNameArr[i], IMAGE 1 NAME
				data: card,  ARRAY [total image 1 vulnerabilties for X TIMESTAMP, total image 1 vulnerabilties for 2nd X TIMESTAMP,] 
				borderColor: 'aqua',
				tension: 0.4
      },
      {
        label: scanNameArr[i], IMAGE 2 NAME
				data: card, [total image 2 vulnerabilties for X TIMESTAMP, total image 2 vulnerabilties for 2nd X TIMESTAMP,] 
				borderColor: 'aqua',
				tension: 0.4
      }
      {...}
    ]
    */
  };
  })
  

  return trigger ? (
    <div className={styles.popup} ref={modalRef}>
      <div className={styles.popupInner}>
        <div className={styles.header}>
          <h2 className={styles.popuptitle}>COMPARE</h2>
          <div
            style={{
              position: "relative",
              display: "inline-block",
              marginTop: "-20px",
              marginLeft: "10px",
            }}
          ></div>
          {/* close button */}
          <button className={styles.closeBtn} onClick={() => setTrigger(false)}>
            x
          </button>
        </div>
        <Tooltip
          title="ADD INFO HERE"
          placement="left-start"
          arrow
          TransitionComponent={Zoom}
        >
          <IconButton style={{ position: "absolute", right: "1px" }}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
        {/* Dropdown Data */}
        <div>
          <DropDownData
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            time={time}
          />
        </div>
        {/* Line Chart */}
        <div>
          <Line data={data} options={options}/>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default CompareModal;
