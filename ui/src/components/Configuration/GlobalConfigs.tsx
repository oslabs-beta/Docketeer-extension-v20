import React, {useState} from 'react';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
import Client from '../../models/Client';
import styles from './config.module.scss'
import { setGlobal } from '../../reducers/configurationReducer';

const GlobalConfigs = (): React.JSX.Element => {

  //dispatch
  const dispatch = useAppDispatch();

  // State
  const global = useAppSelector(state => state.configuration.global);
  const scrapeConfigs = useAppSelector(state => state.configuration.scrapeConfigs);
  const [isEdit, setIsEdit] = useState(false);
  const [localSettings, setLocalSettings] = useState({
    scrape_interval: '',
    evaluation_interval: '',
  })

  const handleEdit = (e) => {
    e.preventDefault();
    setLocalSettings(global);
    setIsEdit(true);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    await Client.ConfigService.updateYaml(localSettings, scrapeConfigs);
    dispatch(setGlobal(localSettings));
    setIsEdit(false);
  }

  return (
    <form action="" className={styles.containerCard}>
      <div className={styles.ConFlex}>
      <h2>Add Configurations</h2>
        <h3>SCRAPE INTERVAL</h3>
        {
          isEdit
            ? (
              <input value={localSettings.scrape_interval} type="text" onChange={(e) => setLocalSettings({
                scrape_interval: e.target.value,
                evaluation_interval: localSettings.evaluation_interval,
              })} />
            )
            : (
              <p>{global.scrape_interval}</p>
            )
        }

        <h3>EVALUATION INTERVAL</h3>
        {
          isEdit
            ? (
              <input value={localSettings.evaluation_interval} type="text" onChange={(e) => setLocalSettings({
                scrape_interval: localSettings.scrape_interval,
                evaluation_interval: e.target.value,
              })} />
            )
            : (
              <p>{global.evaluation_interval}</p>
            )
        }

        {
          isEdit 
            ? (
              <input
                className={styles.btn}
                type='submit'
                value='Submit'
                onClick={handleSubmit}
              />
            )
            : (
              <input
                className={styles.btn}
                type='button'
                value='Edit'
                onClick={handleEdit}
              />
            )
        }
      </div>
    </form>
  );
}



export default GlobalConfigs;