import React from 'react';
import {Breadcrumb, Layout, theme} from 'antd';
import {Link, Outlet, useLocation} from 'react-router-dom';
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

  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const breadcrumbNameMap = (url: string) => {
    return url.split('/').pop();
  }

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return {
      key: url,
      title: <Link to={url}>{breadcrumbNameMap(url)}</Link>,
    };
  });

  const breadcrumbItems = [
    {
      title: <Link to='/'>Home</Link>,
      key: 'home',
    },
  ].concat(extraBreadcrumbItems as any);

  return (
      <Layout>
        <GlobalStyle token={token}/>
        <AppSider token={token}/>
        <ContentLayout className="site-layout" height={height}>
          <StyledHeader
            token={token}
          >
            <Breadcrumb items={breadcrumbItems as any} />
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