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

  async getInitialSources(): Promise<any> {
    try {
      // return await ddClientRequest('http://localhost:49156/api/v1/targets?format=json');
      return await ddClientRequest('/api/prometheus/config/initial');
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

  async createDataSource(id: number, url: string, jobName: string, endpoint: string, match?: string, type_of?: string): Promise<number | null> {
    if (!match) match = '';
    if (!type_of) type_of = '';

    try {
      const body: PromDataSourceType = { id, type_of, url, jobName, endpoint, match}
      const idx: number = await ddClientRequest('/api/prometheus/config', 'POST', body);
      return Number(idx);
    } catch (error) {
      console.error('Could not create data source:', error);
      return null;
    }
  },

  async updateDataSource(id: number, type_of?: string, url?: string, jobName?: string, endpoint?: string, match?: string): Promise<boolean>{
    try {
      const body: PromDataSourceType = { id, type_of, url, jobName, endpoint, match }
      await ddClientRequest('/api/prometheus/config', 'PUT', body);
      return true;
    } catch (error) {
      console.error(`Couldn\'t update data source ${id}:`, error);
      return false;
    }
  },

  async deleteDataSource(id: number): Promise<boolean>{
    try{
      await ddClientRequest(`/api/prometheus/config/${id}`, 'DELETE');
      return true;
    } catch (error) {
      console.error(`Couldn't delete data source`, error);
      return false;
    }
  }
}