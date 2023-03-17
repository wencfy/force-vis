import React from 'react';
import {theme} from "antd";
import {ThemeWrapper} from "./style";
import AppClient from "./AppClient";
import {useAppSelector} from "../../app/hooks";
import {selectTheme} from "./globalConfigSlice";

const App: React.FC = () => {
  const appTheme = useAppSelector(selectTheme);

  return (
    <ThemeWrapper
      theme={{
        algorithm: appTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          borderRadius: 3,
        }
      }}
    >
      <AppClient />
    </ThemeWrapper>
  )
};

export default App;