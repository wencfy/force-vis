import {createBrowserRouter} from "react-router-dom";
import App from "./App";
import DataView from "./DataView";
import DashboardManager from "./DashboardManager";
import Dashboard from "./Dashboard";
import Test from "./Dashboard/Test";
import {getDashboard} from "../utils";
import db from "../utils/db";

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: 'data',
        element: <DataView />,
      },
      {
        path: 'dashboards',
        element: <DashboardManager/>,
        loader: async () => {
          return db.data('dashboard', 'getAll');
        }
      },
      {
        path: 'd/:uid/:name',
        element: <Dashboard/>,
        loader: async ({params}) => {
          return getDashboard({uid: params.uid ?? ''});
        }
      },
      {
        path: 'test',
        element: <Test/>
      }
    ]
  },

]);
