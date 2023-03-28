import {createBrowserRouter} from "react-router-dom";
import App from "./App";
import DataManager from "./DataManager";
import DashboardManager from "./DashboardManager";
import Dashboard from "./Dashboard";
import Test from "./Dashboard/Test";
import {db} from "../utils";

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: 'data',
        element: <DataManager />,
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
