import styled, {createGlobalStyle} from "styled-components";
import {Button, ConfigProvider, GlobalToken, Layout, theme} from "antd";

const {Header, Sider, Content} = Layout;

export const GlobalStyle = createGlobalStyle<{
  token: GlobalToken
}>`
  * {
    margin: 0;
    padding: 0;
  }

  body {
    min-width: 1080px;
  }

  ::-webkit-scrollbar {
    background-color: transparent;
    width: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: inherit;
    border-radius: 8px;
    background-clip: content-box;
    border: 1px solid transparent;
  }

  body[scroll],::-webkit-scrollbar-thumb {
    background-color: rgba(103, 157, 224, 0.1);
    transition: 0s;
  }
`;

export const ThemeWrapper = styled(ConfigProvider)`
`;

export const ContentLayout = styled(Layout)<{
  height?: number
}>`
  margin-left: 56px;
  height: ${props => props.height}px;
`

export const StyledSider = styled(Sider).attrs({
  style: {
    position: 'fixed',
  }
})<{
  token?: GlobalToken,
  collapsed?: boolean,
}>`
  background-color: ${props => props.token?.colorBgContainer} !important;
  min-width: 56px !important;
  height: 100%;
  padding: 0;
  z-index: 1023;

  width: 56px ${props => props.collapsed ? "!important" : ""};


  ul {
    height: 100%;

    svg {
      vertical-align: middle !important;
    }
  }
`;

export const StyledHeader = styled(Header)<{
  token?: GlobalToken
}>`
  padding: 0 16px !important;
  background: ${props => props.token?.colorBgContainer} !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const StyledContent = styled(Content)<{
  token?: GlobalToken,
}>`
  background-color: ${props => props.token?.colorBgContainer};
  padding: 16px;
`

export const MenuCollapseButton = styled(Button)`
  transition: color 0.3s;
  line-height: 12px;

  position: absolute;
  top: 43px;
  right: 0;
  transform: translateX(50%);
  z-index: 1024;
`
