import React, { useState } from 'react';
import { useAppSelector } from '../../reducers/hooks'
import { useAppDispatch} from '../../reducers/hooks';
import styles from './configuration.module.scss'
import Client from '../../models/Client';
import { setScrapeConfigs } from '../../reducers/configurationReducer';

const JobConfigs = ({ index, setIsModified }: {index: number, setIsModified : Function }): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const global = useAppSelector((state) => state.configuration.global);
  const scrapeConfigs = useAppSelector((state) => state.configuration.scrapeConfigs);
  const [isEdit, setIsEdit]: [boolean, Function] = useState(false);

  // localSettings used when editing configurations
  // starts empty but will grab redux scrape config settings upon editing mode (see handleEdit)
  // Editable configurations should not be tied directly to redux global,
  // since that would change prometheus configs without submit button
  const [localSettings, setLocalSettings]: any = useState({});

  // targets is given as array, so separate by space when displaying
  const job = scrapeConfigs[index];
  const jobName = job.job_name;
  const scrapeInterval = job.scrape_interval;
  let targets = '';
  job.static_configs[0].targets.forEach((target) => {
    targets += target + ' ';
  });

  // handles users modifying local settings on Configuration page
  const handleEdit = (e) => {
    e.preventDefault();
    setLocalSettings(job);
    setIsEdit(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // deep clone of current scrape configs
    const newScrapeConfigs = JSON.parse(JSON.stringify(scrapeConfigs));
    // modify our current index config / job with our localSettings
    newScrapeConfigs[index] = localSettings;

    await Client.ConfigService.updateYaml(global, newScrapeConfigs);
    dispatch(setScrapeConfigs(newScrapeConfigs));

    setIsEdit(false);
    setIsModified(true);
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    // deep clone of current scrape configs
    const newScrapeConfigs: [] = JSON.parse(JSON.stringify(scrapeConfigs));
    // modify our current index config / job with our localSettings
    newScrapeConfigs.splice(index, 1);

    await Client.ConfigService.updateYaml(global, newScrapeConfigs);
    dispatch(setScrapeConfigs(newScrapeConfigs));

    setIsEdit(false);
    setIsModified(true);
  };

  return (
    <div className={styles.containerCard}>
      <span>
        <strong style={{color: 'rgb(156, 171, 213)'}}>Job Name: </strong>
        {jobName}
      </span>
      <span>
        <strong style={{color: 'rgb(156, 171, 213)'}}>Scrape Interval: </strong>
        {scrapeInterval}
      </span>
      <span>
        <strong style={{color: 'rgb(156, 171, 213)'}}>Targets: </strong>
        {isEdit ? (
          <input
            style={{ color: 'black', width: '400px' }}
            value={localSettings.static_configs[0].targets}
            type='text'
            onChange={(e) =>
              setLocalSettings({
                ...localSettings,
                static_configs: [{ targets: e.target.value.split(',') }],
              })
            }
          />
        ) : (
          <span>{targets}</span>
        )}
      </span>

      <div className={styles.cardBtns}>
        {isEdit ? (
          <input className={styles.btn} type='submit' value='Submit' onClick={handleSubmit} />
        ) : (
          <input className={styles.btn} type='button' value='Edit' onClick={handleEdit} />
        )}

        <button className={styles.btn} type='submit' name='Submit' onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}



export default JobConfigs;