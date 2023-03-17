import {createBrowserRouter} from "react-router-dom";
import App from "./App";
import DashboardManager from "./DashboardManager";
import Dashboard from "./Dashboard";
import {getDashboard} from "../utils";
import Test from "./Dashboard/Test";

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: 'dashboards',
        element: <DashboardManager/>,
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
