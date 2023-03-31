import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {getDatasourceAsync, selectDatasource} from "./datasourceManagerSlice";
import {DataView} from "../../components";

const DatasourceManager: React.FC = function () {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getDatasourceAsync());
  }, [dispatch]);
  const datasourceState = useAppSelector(selectDatasource);

  return <>
    <DataView storeName='datasource' state={datasourceState}></DataView>
  </>
}

export default DatasourceManager;