import styled from "styled-components";
import { Card, Dropdown, GlobalToken } from "antd";
import { KeyboardArrowDown } from '@styled-icons/material-outlined'

const expandSvg = (color: string) => `
  url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 6" x="0px" y="0px" width="6px" height="6px"><g><path d="M 6 6 L 0 6 L 0 4.2 L 4 4.2 L 4.2 4.2 L 4.2 0 L 6 0 L 6 6 L 6 6 Z" fill="${color}"/></g></svg>');
`

export const StyledCard = styled(Card)<{ token: GlobalToken }>`
  &>.ant-card-head {
    min-height: 32px;
    padding: 0;
    >.ant-card-head-wrapper {
      line-height: 32px;
    }
  }
  
  &+.react-grid-placeholder {
    background: ${props => props.token.colorInfoBg};
    box-shadow: 0 0 6px ${props => props.token.colorInfoBorderHover};
    opacity: unset;
    z-index: 0;
    border-radius: ${props => props.token.borderRadius}px;
  }

  &>.ant-card-body {
    height: -webkit-calc(100% - 32px);
    padding: 0;
    >span {
      background-image: none;
    }
  }
  
  &:hover {
    .ant-card-head-title {
      svg {
        opacity: 1;
        transition: opacity .1s ease-in .2s;
        visibility: visible;
        color: ${props => props.token.colorTextTertiary};
        &:hover {
          color: ${props => props.token.colorText};
        }
      }
    }
    >.ant-card-body>span {
      background-image: ${props => expandSvg(props.token.colorTextQuaternary)}
    }
  }
`;

export const CardTitleWrapper = styled.div<{ token: GlobalToken }>`
  cursor: move;
  display: flex;
  justify-content:center;
  align-items:center;
  color: ${props => props.token.colorTextSecondary};
  
  &:hover {
    background-color: ${props => props.token.colorBgTextHover};
  }
`

export const StyledDropdown = styled(Dropdown)`
  
`;

export const ArrowDown = styled(KeyboardArrowDown)`
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
`
