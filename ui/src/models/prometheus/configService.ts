import { ddClientRequest } from "../ddClientRequest";
import { PromDataSourceType, EndpointType } from "../../../../types";
// import { execAsync } from '../../../../backend/controllers/helper';

export const ConfigService = {

  async getYaml(): Promise<any> {
    try {
      return await ddClientRequest('/api/prometheus/config/initial');
    } catch (error) {
      console.error('Error getting initial configs: ', error);
      return [];
    }
  },

  async updateYaml(global, scrapeConfigs): Promise<any> {
    const body = {
      global: global,
      scrape_configs: scrapeConfigs,
    }

    try {
      return await ddClientRequest('/api/prometheus/config/update', 'POST', body);
    } catch (error) {
      console.error('Error getting initial configs: ', error);
      return [];
    }
  },

  async savePromConfigs(global: object, scrape_configs: any[]): Promise<any>{
    const body = {
      global,
      scrape_configs,
    }

    try {
      await ddClientRequest(`/api/prometheus/config/saveProm`, 'POST', body);
      return;
    } catch (error) {
      console.error(`Couldn't add data source`, error);
      return error;
    }
  }
}