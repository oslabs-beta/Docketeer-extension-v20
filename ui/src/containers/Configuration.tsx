import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../reducers/hooks';
import Client from '../models/Client';
import styles from './C.module.scss'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setGlobal, setScrapeConfigs } from '../reducers/configurationReducer';
import GlobalConfigs from '../components/Configuration/GlobalConfigs';
import JobConfigs from '../components/Configuration/JobConfigs';


const Configuration = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  // Set state of Prom Data Sources upon page load
  const runningList = useAppSelector(store => store.containers.runningList);
  const scrapeConfigs = useAppSelector(store => store.configuration.scrapeConfigs);

  useEffect(() => {
    loadPromSources();
  }, []);

  console.log('scrapeConfigs', scrapeConfigs)

  async function loadPromSources() {
    // On load: clear datasource DB table
    // await Client.ConfigService.clearDataSources();

    //  Grab new targets and parse into correctly formatted array
    const yaml = await Client.ConfigService.getYaml();
    
    dispatch(setGlobal(yaml.global));
    dispatch(setScrapeConfigs(yaml.scrape_configs));
  }

  async function handleRefresh(e: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    e.preventDefault();
    try {
      // grab ID of prometheus container to restart it
      const promContainer = runningList.find((container) => container.Names.includes('prometheus'));

      if (promContainer) {
        await Client.ContainerService.stopContainer(promContainer.ID);
        await Client.ContainerService.runContainer(promContainer.ID);
			  toast.success('Prometheus Reconfigured, Restarting...', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      } else {
        alert('Prometheus container not found.');
      }
    } catch (error) {
      console.error('Failed to refresh Prometheus container:', error);
      alert('Error refreshing Prometheus container.');
    }
  }

  // Child Elements for individual Configuration
  // const dataSourceElements: React.JSX.Element[] = [];
  // Loop through to length of the promDataSource index, passing in the index
  // for (let i = 0; i < promDataSourcesLength; i++){
  //   dataSourceElements.push(<PromDataSource key={`datasource_${i}`} index={i} />);
  // }

  const jobs: React.JSX.Element[] = [];
  for (let i = 0; i < scrapeConfigs.length; i++) {
    jobs.push(<JobConfigs key={`job_${i}`} index={i} />)
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.configurationsTitle}>CONFIGURATIONS</h1>
      <input
          className={styles.Refresh}
          type='submit'
          value='Reconfigure Prometheus'
          onClick={handleRefresh}
      />
      <h3>Global Settings</h3>
      <div className={styles.container}>
        <GlobalConfigs />
      </div>
      <h3>Scrape Configurations</h3>
      <div>
        {jobs}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Configuration;
