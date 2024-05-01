import React from 'react';
import { useAppSelector } from '../../reducers/hooks'
import { useAppDispatch} from '../../reducers/hooks';
// import { PromDataSource } from '../../../../types';
import { setEntryForm, setPrometheusDataSources } from '../../reducers/configurationReducer';
// import styles from '../RunningContainer/RunningContainer.module.scss'
import styles from './config.module.scss'
import Client from '../../models/Client';

const PromDataSource = ({ index }: any): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const promDataSource = useAppSelector(
    (store) => store.configuration.prometheusDataSources[index]
  );
  //TODO: change from React.MouseEvent<HTMLInputElement, MouseEvent> to any for now
  async function handleDelete(e: any) {
    e.preventDefault();
    try {
      const { id, url } = promDataSource;
      console.log('url deleted:', url)
      const res = await Client.ConfigService.deleteDataSource(id, url);
      if (res)
        dispatch(
          setPrometheusDataSources(await Client.ConfigService.getDataSources())
        );
    } catch (error) {
      // Show warning to user here
    }
  }

  async function handleUpdate(
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) {
    e.preventDefault();
    try {
      const {
        id,
        type_of,
        type_of_id,
        url,
        endpoint,
        match,
        jobName,
      } = promDataSource;
      const res = await Client.ConfigService.updateDataSource(
        id,
        type_of_id,
        url,
        jobName,
        endpoint,
        match
      );
      if (res)
        dispatch(
          setPrometheusDataSources(await Client.ConfigService.getDataSources())
        );
    } catch (error) {
      // Show warning to user here
    }
  }

  // The index tells this component which piece of array to grab

  return (
    <div className={styles.containerCard2}>
      <button
        className={styles.Sub1}
        type='submit'
        name='Submit'
        onClick={handleDelete}
      >
        Delete
      </button>
      <div>
        <b>Job Name: </b> <span>{promDataSource.jobName}</span>
      </div>
      <div>
        <b>URL: </b> <span>{promDataSource.url}</span>
      </div>
      <div>
        <b>Endpoint: </b>
        <span>{promDataSource.endpoint}</span>
      </div>
      <div>
        <b>Type of Endpoint: </b>
        <span>{promDataSource.type_of ? promDataSource.type_of : 'prometheus'}</span>
      </div>
      <div className={styles.flexMatch}>
        <b>Matches: </b>
        <span>{promDataSource.match ? promDataSource.match : ''}</span>
      </div>
    </div>
  );
}



export default PromDataSource;