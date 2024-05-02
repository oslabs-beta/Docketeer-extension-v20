import React from 'react';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
import { PromDataSourceType } from '../../../../types';
import { setEntryForm, setPrometheusDataSources } from '../../reducers/configurationReducer';
import Client from '../../models/Client';
import styles from './config.module.scss'

const ConfigurationForm = (): React.JSX.Element => {

  //dispatch
  const dispatch = useAppDispatch();

  // State
  const formState = useAppSelector(store => store.configuration.entryForm);
  const jobnames = useAppSelector(store => store.configuration.jobnames);
  const newIdx = useAppSelector(store => store.configuration.prometheusDataSources.length);

  // Create options for dropdown (starts at blank selection)
  const options: React.JSX.Element[] = [
    <option key={`optid_${-1}`} value={''}></option>
  ];
  jobnames.forEach(job => {
    options.push(
      <option key={`optid_${job}`} value={job}>{job}</option>
    )
  })


  // Update state on inputs
  function handleInput(e: React.ChangeEvent<HTMLInputElement>| React.ChangeEvent<HTMLSelectElement>, key: keyof PromDataSourceType) {
    // Make current form data deep copy
    const copyOfFormData: any = {...formState};
    // Change the key to the event target value
    copyOfFormData[key] = e.target.value;
    dispatch(setEntryForm(copyOfFormData));
  }

  async function handleSubmit(e: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    e.preventDefault();
    try {
      const { jobname, url } = formState;
      const res = await Client.ConfigService.createDataSource(newIdx, jobname, url);
      if (res !== null) dispatch(setPrometheusDataSources(await Client.ConfigService.getDataSources()));
      // Set defaults
      dispatch(setEntryForm({jobname: '', url: ''}));
    } catch (error) {
      // Show warning to user here

    }
  }

  return (
    <form action="" className={styles.containerCard}>
      <div className={styles.ConFlex}>
      <h2>Add Configurations</h2>
      <label htmlFor="">Job Name </label>
      <select name="" id="job_names" value={formState.jobname} onChange={(e)=>handleInput(e, 'jobname')} >
        {options}
      </select>
        </div>
      <div className = {styles.ConFlex}>
      <label htmlFor="">Target URL </label>
        <input type="text" value={formState.url} onChange={(e) => handleInput(e, 'url')} />
      </div>
       {/* <div className = {styles.ConFlex}>
      <label htmlFor="">Endpoint </label>
        <input type="text" value={formState.endpoint} onChange={(e) => handleInput(e, 'endpoint')} />
      </div>
      <div className = {styles.ConFlex}>
      <label htmlFor="">Job Name </label>
        <input type="text" value={formState.jobname} onChange={(e) => handleInput(e, 'jobName')} />
      </div>
      <div className = {styles.ConFlex}>
      <label htmlFor="">Match </label>
        <input type="text" value={formState.match} onChange={(e) => handleInput(e, 'match')} />
      </div> */}
      <input className={styles.Sub} type="submit" name="Submit" onClick={handleSubmit} />
    </form>
  );
}



export default ConfigurationForm;