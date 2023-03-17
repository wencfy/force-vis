import Mock from 'mockjs';
import dashboardsData from './data/dashboards.json';
import dashboardData from './data/dashboard.json';
import graphData from './data/graphData.json';

Mock.mock("/api/v1/dashboards", "post", dashboardsData);

Mock.mock("/api/v1/dashboard/uid/000000011", "get", dashboardData["000000011"]);

Mock.mock("/api/v1/data/uid/00000001", "get", graphData["00000001"]);
