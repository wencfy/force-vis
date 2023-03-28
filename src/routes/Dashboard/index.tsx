import React, {useCallback, useState} from "react";
import {useLoaderData, useSearchParams} from 'react-router-dom';
import GridLayout from "react-grid-layout";
import {FloatButton} from "antd";
import {AddChart, Save} from "@styled-icons/material-outlined";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {Dashboard as DashboardType, DashboardData, DashboardPanel} from "../../utils";
import {NodeGraph, GridPanel} from "../../components";
import EditView from "./EditView";

const defaultDashboard: DashboardData = {
  dashboard: {
    curId: 0,
    panels: [],
  },
  meta: {}
}

function Dashboard() {
  const loaderData = (useLoaderData() as DashboardType);

  // set default value if !exist
  if (!loaderData.data.dashboard) {
    loaderData.data.dashboard = defaultDashboard.dashboard;
  }
  if (!loaderData.data.meta) {
    loaderData.data.meta = defaultDashboard.meta;
  }
  const [data, setData] = useState(loaderData);

  const {curId, panels} = data.data.dashboard;
  const setPanels = (panels: DashboardPanel[]) => {
    setData({
      ...data,
      data: {
        ...data.data,
        dashboard: {
          ...data.data.dashboard,
          panels
        }
      }
    });
  }

  const [searchParams] = useSearchParams();
  const viewPanel = panels.find(panel => panel.id === searchParams.get('viewPanel'));
  const editPanel = panels.find(panel => panel.id === searchParams.get('editPanel'));

  let layout = panels.map((panel) => {
    return {
      i: panel.id,
      ...panel.gridPos,
    }
  });

  let retNode: React.ReactNode;

  const updatePanel = useCallback((id: string, newPanel?: DashboardPanel) => {
    if (newPanel) {
      setPanels(panels.map(panel => {
        if (panel.id === id) {
          return newPanel;
        } else {
          return panel;
        }
      }));
    } else {
      setPanels(panels.filter((panel) => panel.id !== id));
    }
  }, [panels, setPanels]);

  if (editPanel) {
    retNode = (<EditView editPanel={editPanel} updatePanel={updatePanel}/>);
  } else if (viewPanel) {
    retNode = (
      <GridPanel
        style={{height: '100%'}}
        key={viewPanel.id}
        panelInfo={{
          title: viewPanel.panelOptions.title,
          id: viewPanel.id
        }}
        updatePanel={updatePanel}
      >
        <NodeGraph
          {...viewPanel}
          updatePanel={updatePanel}
        />
      </GridPanel>
    )
  } else {
    retNode = (
      <>
        <GridLayout
          className="layout"
          layout={layout}
          cols={16}
          rowHeight={90}
          width={1600}
          onLayoutChange={(layoutList) => {
            let updatedPanels = panels.map(panel => {
              return {
                ...panel,
                gridPos: layoutList.find(layout => layout.i === panel.id) ?? panel.gridPos,
              }
            });
            setPanels(updatedPanels);
          }}
        >
          {panels.map((panel) => {
            return (
              <GridPanel
                key={panel.id}
                panelInfo={{
                  title: panel.panelOptions.title,
                  id: panel.id
                }}
                updatePanel={updatePanel}
              >
                <NodeGraph
                  {...panel}
                  updatePanel={updatePanel}
                />
              </GridPanel>
            );
          })}
        </GridLayout>
        <FloatButton.Group>
          <FloatButton
            icon={<AddChart />}
            onClick={() => {
              const emptyPanel = {
                gridPos: {
                  x: 100,
                  y: 100,
                  w: 5,
                  h: 5,
                },
                id: curId.toString(),
                panelOptions: {
                  title: '',
                },
                nodeOptions: {
                  rules: [],
                }
              }
              setData({
                ...data,
                data: {
                  ...data.data,
                  dashboard: {
                    curId: curId + 1,
                    panels: [...panels, emptyPanel]
                  }
                }
              });
            }}
          />
          <FloatButton
            icon={<Save />}
            onClick={() => {
              console.log(data);
            }}
          />
        </FloatButton.Group>
      </>
    )
  }

  return retNode;
}

export default Dashboard;