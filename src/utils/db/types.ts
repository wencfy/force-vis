export enum ActionEnum {
  ADD = 'add',
  GET = 'get',
  PUT = 'put',
  DEL = 'delete',
  GET_ALL = 'getAll',
}

export interface DashboardData {
  dashboard: {
    panels: Array<DashboardPanel>;
    uid: string;
    title: string;
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
    datasource: string;
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
      };
    }>;
  }
}

export interface Dashboard {
  uid: string;
  name: string;
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
  data: GraphData;
}

export function judge<T>(option: OptionEnum, val1: T, val2: T) {
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
  }
  return ret;
}
