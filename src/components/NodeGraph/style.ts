import styled from "styled-components";
import {Space} from "antd";

export const ViewControl = styled.div`
  display: flex;
  position: absolute;
  align-items: flex-end;
  bottom: 8px;
  left: 8px;
  right: 8px;
  justify-content: space-between;
`;

export const InfoWrapper = styled(Space)`
  >.ant-space-item{
    >.ant-tag {
      >svg {
        height: 20px;
        margin-right: 4px;
      }
    }
  }
`;