import httpClient from "./httpClient";

interface DashboardData {
  dashboard: {
    panels: Array<DashboardPanel>;
    uid: string;
    title: string;
  };
  meta: {}
}

interface DashboardPanel {
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
    key: string;
    rules: Array<{
      fieldName: string;
      value: string;
      type: OptionEnum;
      config: {
        lColor: string;
        lStroke: string;
        dColor: string;
        dStroke: string;
      };
    }>;
  };
  linkOptions: {
    lColor: string;
  }
}

enum OptionEnum {
  EQ = 'EQ',
  GT = 'GT',
  LT = 'LT',
  GE = 'GE',
  LE = 'LE'
}

function judge<T>(option: OptionEnum, val1: T, val2: T) {
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

enum DashboardPanelTypeEnum {
  Graph = 'nodeGraph',
}

interface GetDashboardPayload {
  uid: string;
}

async function getDashboard(payload: GetDashboardPayload): Promise<DashboardData> {
  const {uid} = payload;
  const response = await httpClient.get<{ data: DashboardData }>(`/api/v1/dashboard/uid/${uid}`);
  return response.data.data;
}
