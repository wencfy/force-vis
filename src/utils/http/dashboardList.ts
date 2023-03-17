import httpClient from "./httpClient";

export interface DashboardList {
  schema: {
    name: string;
    meta: {
      count: number;
      locationInfo: Record<string, {
        name: string;
        kind: "folder";
        url: string;
      }>
    };
    fields: Array<{
      name: string;
      type: string;
      typeInfo: {
        frame: string;
        nullable?: boolean;
      };
    }>
  };

  values: Array<Array<any>>;
}

export interface GetDashboardListPayload {

}

export async function getDashboardList(payload?: GetDashboardListPayload): Promise<DashboardList> {
  const response = await httpClient.post<{ data: DashboardList }>('/api/v1/dashboards', payload);
  return response.data.data;
}
