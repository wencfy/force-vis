import {MenuCollapseButton, StyledSider} from "./style";
import {ChevronLeft, ChevronRight, Dashboard, Storage} from "@styled-icons/material-outlined";
import {GlobalToken, Menu} from "antd";
import React, {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

function AppSider({token}: {
  token: GlobalToken
}) {
  const pathname = useLocation().pathname;
  const navigator = useNavigate();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <StyledSider
      trigger={null}
      token={token}
      collapsible
      collapsed={collapsed}
    >
      <div className="logo"/>
      <MenuCollapseButton
        shape='circle'
        icon={collapsed ? (<ChevronRight/>) : (<ChevronLeft/>)}
        size='small'
        onClick={() => setCollapsed(!collapsed)}
      />
      <Menu
        mode="inline"
        defaultSelectedKeys={[pathname]}
        items={[
          {
            key: '/data',
            label: 'data',
            onClick: () => {
              navigator('/data');
            },
            icon: <Storage size={22}/>
          },
          {
            key: '/dashboard',
            label: 'dashboards',
            onClick: () => {
              navigator('/dashboard');
            },
            icon: <Dashboard size={22}/>
          },
        ]}
      >
      </Menu>
    </StyledSider>
  )
}

export default AppSider;
