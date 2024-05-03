import React from 'react';
import { useAppSelector } from '../../reducers/hooks'
import { useAppDispatch} from '../../reducers/hooks';
import styles from './config.module.scss'
import Client from '../../models/Client';

const JobConfigs = ({ index }: any): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const scrapeConfigs = useAppSelector(state => state.configuration.scrapeConfigs);
  const job = scrapeConfigs[index];

  // strings to display
  const jobName = job.job_name;
  const scrapeInterval = job.scrape_interval;
  let targets = '';
  job.static_configs[0].targets.forEach(target => {
    targets += (target + ' ')
  })

  //TODO: change from React.MouseEvent<HTMLInputElement, MouseEvent> to any for now
    // added back type but changed HTMLInputElement to HTML Button Element
  // async function handleDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  // ) {
  //   e.preventDefault();
  //   try {
  //     const { id, url } = promDataSource;
  //     console.log('url deleted:', url)
  //     const res = await Client.ConfigService.deleteDataSource(id, url);
  //     if (res)
  //       dispatch(
  //         setPrometheusDataSources(await Client.ConfigService.getDataSources())
  //       );
  //   } catch (error) {
  //     // Show warning to user here
  //   }
  // }

  // async function handleUpdate(
  //   e: React.MouseEvent<HTMLInputElement, MouseEvent>
  // ) {
  //   e.preventDefault();
  //   try {
  //     const {
  //       id,
  //       jobname,
  //       url,
  //     } = promDataSource;
  //     const res = await Client.ConfigService.updateDataSource(id, jobname, url);
  //     if (res)
  //       dispatch(
  //         setPrometheusDataSources(await Client.ConfigService.getDataSources())
  //       );
  //   } catch (error) {
  //     // Show warning to user here
  //   }
  // }

  // The index tells this component which piece of array to grab




  return (
    <div className={styles.containerCard2}>
      <button
        className={styles.Sub1}
        type='submit'
        name='Submit'
      >
        Delete
      </button>
      <div>
        <b>Job Name: </b> <span>{jobName}</span>
        <br />
        <b>Job Name: </b> <span>{scrapeInterval}</span>
        <br />
        <b>Targets: </b> <span>{targets}</span>
      </div>
    </div>
  );
}



export default JobConfigs;