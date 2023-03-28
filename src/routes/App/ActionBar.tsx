import React from "react";
import {Button, Space, Tooltip} from "antd";
import {DarkMode, LightMode, Login} from "@styled-icons/material-outlined";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {changeTheme, selectTheme} from "./globalConfigSlice";

const ActionBar: React.FC = function () {
  const dispatch = useAppDispatch();
  const appTheme = useAppSelector(selectTheme);

  return (
    <Space>
      <Tooltip title='change theme'>
        <Button
          type='text'
          icon={appTheme === 'dark' ? <DarkMode size={18}/> : <LightMode size={18} /> }
          onClick={() => {
            dispatch(changeTheme());
          }}
        />
      </Tooltip>
    </Space>
  )
}

export default ActionBar;