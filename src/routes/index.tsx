import {createBrowserRouter} from "react-router-dom";
import App from "./App";
import DatasourceManager from "./DatasourceManager";
import DashboardManager from "./DashboardManager";
import Dashboard from "./Dashboard";
import Test from "./Test";
import {db} from "../utils";

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: 'data',
        element: <DatasourceManager />,
      },
      {
        path: 'dashboards',
        element: <DashboardManager/>,
        loader: async () => {
          return await db.data('dashboard', 'getAll');
        }
      },
      {
        path: 'dashboard/:uid/:name',
        element: <Dashboard/>,
        loader: async ({params}) => {
          return await db.data('dashboard', "get", params.uid);
        }
      },
      {
        path: 'test',
        element: <Test/>
      }
    ]
  },

]);
