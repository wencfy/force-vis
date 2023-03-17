import React from "react";
import {List} from "antd";
import {AppSelector, useAppSelector} from "../../app/hooks";
import {ListViewData} from "../../app/types";
import {ListItem} from "./ListItem";

interface ListProps<T> {
  dataSelector: AppSelector<T>;
}

const ListView = function <T extends ListViewData>({dataSelector}: ListProps<T>) {

  const data = useAppSelector(dataSelector);

  return <List
    itemLayout="vertical"
    loading={data.status === "loading"}
    dataSource={data.values}
    renderItem={(item, index) => {
      return <ListItem item={item} key={index}></ListItem>
    }}
    style={{
      height: 600,
      overflow: 'auto'
    }}
  />
}

export default ListView;
