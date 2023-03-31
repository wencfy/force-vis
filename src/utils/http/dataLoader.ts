import httpClient from "./httpClient";
import {Datasource, db} from "../db";

interface GetDataPayload {
  uid: string;
}

async function getNetworkData<T>(payload: GetDataPayload): Promise<T> {
  const {uid} = payload;
  const response = await httpClient.get<{ data: T }>(`/api/v1/data/uid/${uid}`);
  return response.data.data;
}

async function getData<T>(payload: GetDataPayload): Promise<T> {
  const {uid} = payload;
  const datasource = await db.data<Datasource, 'get'>('datasource', "get", uid);
  console.log(datasource)
  return datasource.data as T;
}

interface GraphData {
  nodes: Array<{
    id: string | number;
    [key: string]: any;
  }>;
  links: Array<{
    id: string | number;
    source: string | number;
    target: string | number;
    start?: number;
    end?: number;
    [key: string]: any;
  }>
}

class DataLoader<T> {
  constructor() {
    console.log('DataLoader constructor called!');
    this.dataStorage = {};
  }

  dataStorage: Record<string, T>;

  async getData(uid: string): Promise<T> {
    if (!this.dataStorage[uid]) {
      this.dataStorage[uid] = await getData<T>({uid});
    }
    return this.dataStorage[uid];
  }
}

const graphDataLoader = new DataLoader<GraphData>();

export {graphDataLoader};
