import React, {useState} from 'react';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
import Client from '../../models/Client';
import styles from './configuration.module.scss'
import { setGlobal } from '../../reducers/configurationReducer';

const GlobalConfigs = ({ setIsModified }): React.JSX.Element => {

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
    setIsModified(true);
  }

  return (
    <form action="" className={styles.containerCard}>
      <span>
        <strong>Scrape Interval: </strong>
        {isEdit ? (
          <input
            style={{ color: "black" }}
            value={localSettings.scrape_interval}
            type="text"
            onChange={(e) =>
              setLocalSettings({
                scrape_interval: e.target.value,
                evaluation_interval: localSettings.evaluation_interval,
              })
            }
          />
        ) : (
          <span>{global.scrape_interval}</span>
        )}
      </span>

      <span>
        <strong>Evaluation Interval: </strong>
        {isEdit ? (
          <input
            style={{ color: "black" }}
            value={localSettings.evaluation_interval}
            type="text"
            onChange={(e) =>
              setLocalSettings({
                scrape_interval: localSettings.scrape_interval,
                evaluation_interval: e.target.value,
              })
            }
          />
        ) : (
          <span>{global.evaluation_interval}</span>
        )}
      </span>
      <div className={styles.cardBtns}>
        {isEdit ? (
          <input
            className={styles.btn}
            type="submit"
            value="Submit"
            onClick={handleSubmit}
          />
        ) : (
          <input
            className={styles.btn}
            type="button"
            value="Edit"
            onClick={handleEdit}
          />
        )}
      </div>
    </form>
  );
}



export default GlobalConfigs;