import React, {useState} from "react";
import {List} from "antd";
import {Folder, ExpandMore, ExpandLess} from "@styled-icons/material-outlined";
import InnerList from "./InnerList";

const ListItem: React.FC<
  { item: Array<any> }
> = function (
  {
    item: [
      kind, uri, name, url, tags, location
    ]
  }
) {
  const [isExpand, setIsExpand] = useState(false);

  return <List.Item
    onClick={() => setIsExpand(!isExpand)}
    extra={isExpand ?
      <ExpandLess
        size={16}
      /> :
      <ExpandMore
        size={16}
      />
    }
  >
    <List.Item.Meta
      avatar={<Folder size={16}/>}
      title={name}
    />
    {isExpand && <InnerList folder={uri as string} />}
  </List.Item>
}

export {ListItem};