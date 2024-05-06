import { ddClientRequest } from "../ddClientRequest";
import { PromDataSourceType, EndpointType } from "../../../../types";
// import { execAsync } from '../../../../backend/controllers/helper';

export const ConfigService = {

  async clearDataSources(): Promise<any> {
    try {
      return await ddClientRequest('/api/prometheus/config/', 'DELETE');
    } catch (error) {
      console.error('Error deleting data sources from DB: ', error);
      return [];
    }
  },

  async getYaml(): Promise<any> {
    try {
      // return await ddClientRequest('http://localhost:49156/api/v1/targets?format=json');
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

  async getDataSources(): Promise<PromDataSourceType[]> {
    try {
      return await ddClientRequest('/api/prometheus/config');
    } catch (error) {
      console.error('Error getting configs: ', error);
      return [];
    }
  },

  async getEndpointTypes(): Promise<EndpointType[]> {
    try {
      return await ddClientRequest('/api/prometheus/config/types');
    } catch (error) {
      console.error('Error getting endpoint types:', error);
      return [];
    }
  },

  async createDataSource(id: number, jobname: string, url: string, endpoint?: string, match?: string, type_of?: string): Promise<number | null> {
    if (!match) match = '';
    if (!type_of) type_of = '';

    try {
      const body: PromDataSourceType = { id, jobname, url}
      const idx: number = await ddClientRequest('/api/prometheus/config', 'POST', body);
      return Number(idx);
    } catch (error) {
      console.error('Could not create data source:', error);
      return null;
    }
  },

  async updateDataSource(id: number, type_of?: string, url?: string, jobname?: string, endpoint?: string, match?: string): Promise<boolean>{
    try {
      const body: PromDataSourceType = { id, type_of, url, jobname, endpoint, match }
      await ddClientRequest('/api/prometheus/config', 'PUT', body);
      return true;
    } catch (error) {
      console.error(`Couldn\'t update data source ${id}:`, error);
      return false;
    }
  },

  async deleteDataSource(id: number, url: string): Promise<boolean>{
    try{
      await ddClientRequest(`/api/prometheus/config/${id}/${url}`, 'DELETE');
      return true;
    } catch (error) {
      console.error(`Couldn't delete data source`, error);
      return false;
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