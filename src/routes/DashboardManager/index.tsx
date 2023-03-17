import {getDashboardsAsync, selectFolders} from "./dashboardManagerSlice";
import {useAppDispatch} from "../../app/hooks";
import {ListView} from '../../components';
import {ListViewData} from "../../app/types";

function DashboardManager() {

  const dispatch = useAppDispatch();
  dispatch(getDashboardsAsync());

  return <ListView<ListViewData> dataSelector={selectFolders}/>
}

export default DashboardManager;
