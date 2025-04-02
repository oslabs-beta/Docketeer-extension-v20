import React, { useState, useEffect } from 'react';
import styles from './Metrics.module.scss';
import { Metric, MetricsEntry, metricData } from 'types';
import Client from '../../models/Client'
import MetricFilterButton from './MetricFilterButton';

const Metrics = (): JSX.Element => {
  const [messageVisible, setMessageVisible] = useState<boolean>(false);
  const [resetIframe, setResetIframe] = useState<boolean>(true);
  //Refreshing the page back to home 
  const handleHome = (): void => {
    setResetIframe(resetIframe ? false : true);
  };

  // Get Metrics by querying Promtheus for each metric and saving it to PostgreSQL 
  const getMetrics = async (): Promise<void> => {
    const date:string = new Date().toISOString();
    const metrics: Metric[] = [
      {
        metricName: 'diskSpace',
        metricQuery: 'round(sum(container_fs_usage_bytes{job="localprometheus"}) by (container_name) / sum(container_fs_limit_bytes{job="localprometheus"}) by (container_name), 0.001)'
      },
      {
        metricName: 'memory',
        metricQuery: 'round((1 - (node_memory_MemAvailable_bytes{job="localprometheus"} / node_memory_MemTotal_bytes{job="localprometheus"})), 0.001)'
      },
      {
        metricName: 'swap',
        metricQuery: 'round((1 - (node_memory_SwapFree_bytes{job="localprometheus"} / node_memory_SwapTotal_bytes{job="localprometheus"})), 0.001)'
      },
      {
        metricName: 'CPU_usage',
        metricQuery: 'sum(rate(process_cpu_seconds_total{job="localprometheus"}[5m])) * 100'
      },
      {
        metricName: 'available_Memory',
        metricQuery: 'node_memory_MemTotal_bytes{job="localprometheus"} - node_memory_MemAvailable_bytes{job="localprometheus"}'
      },
    ];

    const metricsEntry:MetricsEntry = {}
    metricsEntry['date'] = date;

    const fetchPromises: Promise<void>[]= metrics.map(async metric => {
      const { metricName, metricQuery } = metric;
      const res = await fetch(`http://localhost:49156/api/v1/query?query=${metricQuery}&time=${date}`);
      const metricData:metricData = await res.json();
      metricsEntry[metricName] = metricData.data;
    })

    await Promise.all(fetchPromises);
    const data = await Client.MetricService.createMetrics(metricsEntry)

    setMessageVisible(true); 
     setTimeout(() => {
      setMessageVisible(false); 
    }, 3000); 
  }







  const actions = [
    {
      id: "action1",
      label: "CPU %",
      handler: () => console.log("Email notification sent"),
    },
    {
      id: "action2",
      label: "MEMORY USAGE",
      handler: () => console.log("Database updated"),
    },
    {
      id: "action3",
      label: "MEM %",
      handler: () => console.log("Report generated"),
    },
    {
      id: "action4",
      label: "NET I/O",
      handler: () => console.log("Records archived"),
    },
    {
      id: "action5",
      label: "BLOCK I/O",
      handler: () => console.log("Cloud sync completed"),
    },
    {
      id: "action6",
      label: "PID",
      handler: () => console.log("Cache cleared"),
    },
  ];





  

  return (
    <div>
      <div className={styles.iframeHeader}>
        <h1 className={styles.metricsTitle}>METRICS DASHBOARD</h1>
        <div className={styles.buttonDiv}>
          <button className={styles.button} onClick={handleHome}>
            HOME
          </button>
          <button className={styles.button} onClick={getMetrics}>
            SAVE METRICS
          </button>
          <MetricFilterButton buttonText={"test"} actions={actions} />
        </div>
      </div>

         
      {messageVisible && (
         <div className={`${styles.toast} ${styles.visible}`}>Metrics Saved!</div>
      )}


      <div className={styles.iframeDiv}>
        <iframe
          key={resetIframe}
          id="iframe"
          className={styles.metrics}
          src="http://localhost:49155/d/metrics_monitoring/docker-and-system-monitoring?orgId=1&refresh=5s&kiosk"
        />
      </div>
    </div>
  );
};

export default Metrics;
