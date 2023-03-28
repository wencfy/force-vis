import {useEffect} from "react";
import {getDashboardsAsync, selectDashboard} from "../../utils";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {DataView} from "../../components";

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
