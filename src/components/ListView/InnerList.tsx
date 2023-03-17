import {List} from "antd";
import {useNavigate} from "react-router-dom";
import {useAppSelector} from "../../app/hooks";
import {selectDashboardsByFolder} from "../../routes/DashboardManager/dashboardManagerSlice";
import {DashboardCustomize} from "@styled-icons/material-outlined";
import React from "react";

const InnerList: React.FC<{folder: string}> = ({folder}) => {

  const dashboards = useAppSelector(selectDashboardsByFolder(folder));
  console.log(dashboards);

  const navigate = useNavigate();


  return <List
    style={{padding: 16}}
    dataSource={dashboards}
    renderItem={(item, index) => {
      const [
        kind, uri, name, url, tags, location
      ] = item;

      console.log(url)

      return <List.Item
        key={index}
        onClick={() => {
          navigate(url);
        }}
      >
        <List.Item.Meta
          avatar={<DashboardCustomize size={16}/>}
          title={name}
        />
      </List.Item>
    }}
  >

  </List>
}

export default InnerList;
