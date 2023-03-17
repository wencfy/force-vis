import httpClient from "./httpClient";

interface GetDataPayload {
  uid: string;
}

async function getData<T>(payload: GetDataPayload): Promise<T> {
  const { uid } = payload;
  const response = await httpClient.get<{ data: T }>(`/api/v1/data/uid/${uid}`);
  return response.data.data;
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

export { graphDataLoader };
