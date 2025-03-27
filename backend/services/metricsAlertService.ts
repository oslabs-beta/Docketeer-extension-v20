import AlertSystem from '../controllers/alertSystem/alertSystem';

class MetricsAlertService {
  private alertSystem: AlertSystem;
  private checkInterval: NodeJS.Timeout | null;

  constructor() {
    this.alertSystem = new AlertSystem();
    this.checkInterval = null;
  }

  startMonitoring(intervalMs: number = 60000): void {
    if (this.checkInterval) {
      console.warn('Metrics monitoring is already running');
      return;
    }

    // Set up default alert configurations
    this.setupDefaultAlerts();

    // Start periodic checking
    this.checkInterval = setInterval(() => {
      this.checkMetrics();
    }, intervalMs);

    console.log('Metrics monitoring started');
  }

  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('Metrics monitoring stopped');
    }
  }

  private setupDefaultAlerts(): void {
    // CPU Usage Alert
    this.alertSystem.addAlert({
      metricName: 'CPU_usage',
      threshold: 80, // 80% CPU usage
      comparison: '>',
      emailRecipients: [process.env.ALERT_EMAIL_RECIPIENTS || 'admin@docketeer.com'],
    });

    // Memory Usage Alert
    this.alertSystem.addAlert({
      metricName: 'memory',
      threshold: 0.9, // 90% memory usage
      comparison: '>',
      emailRecipients: [process.env.ALERT_EMAIL_RECIPIENTS || 'admin@docketeer.com'],
    });

    // Disk Space Alert
    this.alertSystem.addAlert({
      metricName: 'diskSpace',
      threshold: 0.85, // 85% disk space usage
      comparison: '>',
      emailRecipients: [process.env.ALERT_EMAIL_RECIPIENTS || 'admin@docketeer.com'],
    });
  }

  private async checkMetrics(): Promise<void> {
    try {
      const date = new Date().toISOString();
      console.log('Checking metrics at:', date);

      const metrics = [
        {
          metricName: 'diskSpace',
          metricQuery: 'round(sum(container_fs_usage_bytes{job="localprometheus"}) by (container_name) / sum(container_fs_limit_bytes{job="localprometheus"}) by (container_name), 0.001)'
        },
        {
          metricName: 'memory',
          metricQuery: 'round((1 - (node_memory_MemAvailable_bytes{job="localprometheus"} / node_memory_MemTotal_bytes{job="localprometheus"})), 0.001)'
        },
        {
          metricName: 'CPU_usage',
          metricQuery: 'sum(rate(process_cpu_seconds_total{job="localprometheus"}[5m])) * 100'
        }
      ];

      const metricsData: Record<string, number> = {};

      for (const metric of metrics) {
        console.log(`Fetching ${metric.metricName} metric...`);
        const response = await fetch(
          `http://localhost:49156/api/v1/query?query=${metric.metricQuery}&time=${date}`
        );
        const data = await response.json();

        if (data.data && data.data.result && data.data.result[0]) {
          metricsData[metric.metricName] = parseFloat(data.data.result[0].value[1]);
          console.log(`${metric.metricName} value:`, metricsData[metric.metricName]);
        } else {
          console.log(`No data received for ${metric.metricName}`);
        }
      }

      console.log('Checking thresholds for metrics:', metricsData);
      await this.alertSystem.checkMetrics(metricsData);
    } catch (error) {
      console.error('Error checking metrics:', error);
    }
  }
}

export default new MetricsAlertService(); 