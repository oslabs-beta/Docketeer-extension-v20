import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../reducers/hooks';
import { createAlert } from '../../reducers/alertReducer';
import { ContainerType, ContainersCardsProps, stats } from '../../../ui-types';
import RunningContainer from '../RunningContainer/RunningContainer';
import PageSwitch from './PageSwitch';
import Client from '../../models/Client';
import { fetchNetworkAndContainer } from '../../reducers/networkReducer';

/**
 * @module | ContainersCard.tsx
 * @description | This component renders RunningContainer component and passes functions for connecting/disconnecting to the network as props.
 **/

/**
 * A custom hook which gets the stats of all Docker containers.
 */
const ContainersCard = ({
  containerList,
  stopContainer,
  runContainer,
  removeContainer,
  bashContainer,
  status,
}: ContainersCardsProps): JSX.Element => {

  const dispatch = useAppDispatch();
  const [containerMetrics, setContainerMetrics] = useState<stats[]>();


 // retrieves container data by fetching from Docker 
  let ddClient;
  useEffect(() => {
    async function displayMetrics() {
      try {
        let newData: stats[] = [];
        // This is unicode by the way
        // const TERMINAL_CLEAR_CODE = '\x1B[2J[H';
        const TERMINAL_CLEAR_CODE = /\x1B[[0-9;]*[a-zA-Z]/g;
        const { createDockerDesktopClient } = await import("@docker/extension-api-client");
        ddClient = createDockerDesktopClient();
        ddClient.docker.cli.exec(
          'stats',
          ['--all', '--no-trunc', '--format', '{{ json . }}'],
          {
            stream: {
              onOutput(data) {
                // console.log("data", data)
                // if (data.stdout?.includes(TERMINAL_CLEAR_CODE)) {
                // removed above if statement in favor of the one below because of an issue with
                // the JSON.parse line (was previously testing to see if TERMINAL_CLEAR_CODE)
                // TODO finish this ^
                if(TERMINAL_CLEAR_CODE.test(data.stdout)) {
                  setContainerMetrics(newData);
                  console.log('containerMetrics', containerMetrics)
                  newData = [];
                  newData.push(JSON.parse(data.stdout.replace(TERMINAL_CLEAR_CODE, '')));
                } else {
                  newData.push(JSON.parse(data.stdout ?? ''));
                }
              },
              onError(error) {
                console.error(error);
              },
              splitOutputLines: true,
            },
          }
        );
      } catch (error) {
        console.log(`Can't import ddClient`);
      }
    }
    displayMetrics();

  
  }, [ddClient]);

  async function connectToNetwork(
    networkName: string,
    containerName: string
  ): Promise<void> {
    try {
      const result = await Client.NetworkService.connectContainerToNetwork(networkName, containerName);
      if (result) {
        dispatch(fetchNetworkAndContainer());
      }

    } catch (err) {
      dispatch(
        createAlert(
          'An error occurred while attaching to network : ' + err,
          4,
          'error'
        )
      );
    }
  }

  async function disconnectFromNetwork(
    networkName: string,
    containerName: string,
  ): Promise<void> {
    try {
      const result = await Client.NetworkService.disconnectContainerFromNetwork(networkName, containerName);
      if (result) {
        dispatch(fetchNetworkAndContainer());
      }
    } catch (err) {
      dispatch(
        createAlert(
          'An error occurred while disconnecting from network : ' + err,
          4,
          'error'
        )
      );
    }
  }

  // populates each container card with metrics 
  console.log("sdfsfs", containerList)
  // TODO containerList.map isn't a function or something error popped up before
  // TODO try to get this error to pop up again and then fix it somehow
  const RunningContainers = containerList.map((container: ContainerType, i: number) => {
    let metrics = null;
    if (containerMetrics !== undefined) {
      for (const item of containerMetrics) {
        if (item.Container === container.ID) {
          metrics = item;
          break;
        }
      }
    }
    
    return (
      <RunningContainer
        container={container}
        metrics={metrics}
        key={`container-${i}`}
        stopContainer={stopContainer}
        runContainer={runContainer}
        removeContainer={removeContainer}
        bashContainer = {bashContainer}
        connectToNetwork={connectToNetwork}
        disconnectFromNetwork={disconnectFromNetwork}
        status={status}/>
    );
  }
  );
  const [currentPage, setPage] = useState(1);
  const COUNT_PER_PAGE = 5;
  // index of last container on each page
  const lastContainerI = COUNT_PER_PAGE * currentPage;
  const firstContainerI = lastContainerI - COUNT_PER_PAGE;
  const slicedRunningContainers = RunningContainers.slice(firstContainerI, lastContainerI);
  return (
    <>
      {slicedRunningContainers}
      <PageSwitch totalContainers = {RunningContainers.length} setPage = {setPage} contPerPage = {COUNT_PER_PAGE}/>
    </>
  );
};

export default ContainersCard;