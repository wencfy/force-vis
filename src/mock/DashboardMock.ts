import Mock from 'mockjs';
import dashboardsData from './data/dashboards.json';
import dashboardData from './data/dashboard.json';
import graphData from './data/graphData.json';
import db from "../utils/db";
import {ActionEnum} from "../utils/db/types";

Mock.mock("/api/v1/dashboards", "post", dashboardsData);

Mock.mock(/\/api\/v1\/dashboard\/uid\//, "get", dashboardData["000000011"]);

Mock.mock("/api/v1/data/uid/00000001", "get", graphData["00000001"]);

// db.data('dashboard', ActionEnum.ADD, {
//   uid: '000000011',
//   name: 'Graphite Carbon Metrics',
//   url: '/d/000000011/graphite-carbon-metrics',
//   data: dashboardData["000000011"].data as DashboardData,
//   tags: []
// }).then(res => {
//   console.log(res)
// })

db.data('dashboard', ActionEnum.GET_ALL).then(console.log);
