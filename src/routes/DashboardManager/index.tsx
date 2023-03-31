import {useCallback, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {DataView} from "../../components";
import {getDashboardsAsync, selectDashboard} from "./dashboardManagerSlice";

function DashboardManager() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getDashboardsAsync());
  }, [dispatch]);
  const dashboardState = useAppSelector(selectDashboard);

  return <DataView
    state={dashboardState}
    storeName='dashboard'
  ></DataView>;
}

export default DashboardManager;
