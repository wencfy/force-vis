import styled from "styled-components";
import {Space} from "antd";

export const TableWrapper = styled(Space)`
  width: 100%;
  
  &>.ant-space-item>.ant-btn {
    display: flex;
    align-items: center;
    >svg {
      margin-right: 4px;
    }
  }
`;