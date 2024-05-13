import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../reducers/hooks';
import Client from '../../models/Client';
import styles from './configuration.module.scss'
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setGlobal, setScrapeConfigs } from '../../reducers/configurationReducer';
import GlobalConfigs from './GlobalConfigs';
import JobConfigs from './JobConfigs';


const Configuration = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  // Set state of Prometheus Data Sources upon page load
  const runningList = useAppSelector(store => store.containers.runningList);
  const globalConfigs = useAppSelector(store => store.configuration.global);
  const scrapeConfigs = useAppSelector(store => store.configuration.scrapeConfigs);
  const [isModified, setIsModified] = useState(false);

  // get Prometheus sources if first time loading
  useEffect(() => {
    loadPromSources();
  }, []);

  // Config for Toast (aka pop-ups)
  const toastConfig: ToastOptions<unknown> = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  async function loadPromSources() {
    //  Grab new targets and parse into correctly formatted array
    const yaml = await Client.ConfigService.getYaml();
    
    // set redux states
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
        toast.success('Prometheus Reconfigured, Restarting...', toastConfig);
      } else {
        toast.error("Prometheus Container Not Found.", toastConfig);
      }

      setIsModified(false);
    } catch (error) {
      console.error('Failed to refresh Prometheus container:', error);
      alert('Error refreshing Prometheus container.');
    }
  }

  async function handleSave(e) {
    try {
      await Client.ConfigService.savePromConfigs(globalConfigs, scrapeConfigs);
      toast.success("Saved Prometheus Configs!", toastConfig);
    }
    catch (err) {
      toast.error("Problem Saving Prometheus Configs.", toastConfig);
    }
  }

  // Array of each scrape config job on Prometheus
  const jobs: React.JSX.Element[] = [];
  for (let i = 0; i < scrapeConfigs.length; i++) {
    jobs.push(<JobConfigs key={`job_${i}`} index={i} setIsModified={setIsModified} />)
  }

  return (
    <div className={styles.configurationContainer}>
      <div className={styles.configurationHeader}>
        <h1 className={styles.configurationsTitle}>CONFIGURATIONS</h1>
        <div className={styles.headerBtns}>
          {isModified ? (
            <h3 style={{ color: "yellow", alignSelf: "center" }}>
              NEED TO RECONFIGURE PROMETHEUS TO APPLY
            </h3>
          ) : (
            <h3></h3>
          )}
          <input
            className={styles.btn}
            style={isModified ? { color: "yellow", fontWeight: 'bold', border: '1px solid yellow' } : {}}
            type="submit"
            value="Reconfigure Prometheus"
            onClick={handleRefresh}
          />
          <input
            className={styles.btn}
            type="submit"
            value="Export to Database"
            onClick={handleSave}
          />
        </div>
      </div>

      <div className={styles.configColumns}>
        <div className={styles.column}>
          <h3>Global Settings</h3>
          <div className={styles.container}>
            <GlobalConfigs setIsModified={setIsModified} />
          </div>
        </div>

        <div className={styles.column}>
          <h3>Scrape Configurations</h3>
          <div className={styles.container}>{jobs}</div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Configuration;
