import React from "react";
import {useAppSelector} from "../../app/hooks";
import {selectDashboard} from "../../utils/db";

const ListView: React.FC = function () {
  const dashboards = useAppSelector(selectDashboard);
  console.log(dashboards);

  return <></>
}

export default ListView;