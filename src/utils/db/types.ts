export interface RetData<T>  {
  add: Promise<null>,
  get: Promise<T>,
  put: Promise<null>,
  delete: Promise<null>,
  getAll: Promise<Array<T>>,
}

export type Actions = keyof RetData<null>;

export interface DashboardData {
  dashboard: {
    curId: number;
    panels: Array<DashboardPanel>;
  };
  meta: {}
}

export interface DashboardPanel {
  gridPos: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  id: string;
  panelOptions: {
    datasource?: string;
    algorithm: string;
    title: string;
  };
  nodeOptions: {
    key?: string;
    rules: Array<{
      fieldName?: string;
      value?: string;
      type?: `${OptionEnum}`;
      config?: {
        lColor?: string;
        lStroke?: string;
        dColor?: string;
        dStroke?: string;
        size?: number;
      };
    }>;
  }
}

export interface Dashboard {
  uid: string;
  name: string;
  lastModified: number;
  url: string;
  tags: Array<string>;
  data: DashboardData;
}

export enum OptionEnum {
  EQ = 'EQ',
  GT = 'GT',
  LT = 'LT',
  GE = 'GE',
  LE = 'LE'
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

export interface Datasource {
  uid: string;
  name: string;
  meta: any;
  tags: Array<string>;
  data: GraphData;
  lastModified: number;
}

export function judge<T>(val1: T, val2: T, option?: `${OptionEnum}`) {
  if (!option) {
    return false;
  }

  let ret: boolean;
  switch (option) {
    case OptionEnum.EQ:
      ret = val1 === val2;
      break;
    case OptionEnum.GE:
      ret = val1 >= val2;
      break;
    case OptionEnum.LE:
      ret = val1 <= val2;
      break;
    case OptionEnum.GT:
      ret = val1 > val2;
      break;
    case OptionEnum.LT:
      ret = val1 < val2;
      break;
    default:
      ret = false;
      break;
  }
  return ret;
}
