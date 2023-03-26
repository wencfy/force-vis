import {getDashboardsAsync} from "../../utils/db";
import {useAppDispatch} from "../../app/hooks";
import {ListView} from "../../components";

function DashboardManager() {

  const dispatch = useAppDispatch();
  dispatch(getDashboardsAsync());

  return <ListView></ListView>;
}

export default DashboardManager;
