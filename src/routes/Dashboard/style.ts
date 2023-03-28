import styled from "styled-components";
import {Card, Row, Space} from "antd";

export const ActionWrapper = styled(Space)<{color?: string}>`
  display: flex;
  position: absolute;
  align-items: flex-end;
  justify-content: end;
  padding: 8px;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.color};
`;

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

  .ant-card-body {
    padding: 0;
    height: 100%;
    
    >form {
      overflow-y: scroll;
      height: calc(100% - 40px);
    }
    
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