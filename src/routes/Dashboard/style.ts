import styled from "styled-components";
import {Card, Row} from "antd";

export const EditViewWrapper = styled(Row).attrs({
  gutter: 16
})`
  height: calc(100% - 8px);
  .ant-col {
    height: 100%
  }
`;

export const ControlBoardWrapper = styled(Card)`
  height: 100%;
  overflow-y: scroll;

  .ant-card-body {
    padding: 0;

    .ant-collapse-header {
      padding: 4px 6px;
    }
  }
`;

export const RuleWrapper = styled.div`
  .ant-space-compact {
    .ant-form-item-label {
      padding-bottom: 0;
      margin-bottom: -6px;
      label {
        font-size: 10px;
      }
    }
  }
`;

export const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  .ant-space-compact {
    .ant-form-item {
      margin-bottom: 0;
    }
  }
  
  &>svg {
    min-width: 18px;
    margin-right: 8px;
  }
`;