import React from 'react';
import {Layout, theme} from 'antd';
import {Outlet} from 'react-router-dom';
import {
  ContentLayout,
  GlobalStyle,
  StyledContent,
  StyledHeader,
} from "./style";
import {useWindowSize} from "../../utils";
import AppSider from "./AppSider";
import ActionBar from "./ActionBar";

const App: React.FC = () => {
  const token = theme.useToken().token;
  const {height} = useWindowSize();

  return (
      <Layout>
        <GlobalStyle token={token}/>
        <AppSider token={token}/>
        <ContentLayout className="site-layout" height={height}>
          <StyledHeader
            token={token}
          >
            hello
            <ActionBar/>
          </StyledHeader>
          <StyledContent
            token={token}
          >
            <Outlet/>
          </StyledContent>
        </ContentLayout>
      </Layout>
  );
};

export default App;