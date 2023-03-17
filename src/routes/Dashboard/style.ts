import styled from "styled-components";
import {Card, Row} from "antd";

export const EditViewWrapper = styled(Row).attrs({
  gutter: 16
})`
  height: calc(100% - 32px);
  //height: 100%;
`;

export const ControlBoardWrapper = styled(Card)`
  height: calc(100%);

  .ant-card-body {
    padding: 0;

    .ant-collapse-header {
      padding: 4px 6px;
    }
  }
`;