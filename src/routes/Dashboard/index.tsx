import React, {useState} from "react";
import {useLoaderData, useSearchParams} from 'react-router-dom';
import GridLayout from "react-grid-layout";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {DashboardData} from "../../utils";
import GridPanel from "../../components/GridPanel";
import NodeGraph from "../../components/NodeGraph";
import EditView from "./EditView";

function Dashboard() {
  const {dashboard} = useLoaderData() as DashboardData;
  const [panels, setPanels] = useState(dashboard.panels);
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

  if (editPanel) {
    retNode = (<EditView editPanel={editPanel}/>);
  } else if (viewPanel) {
    retNode = (
      <GridPanel
        style={{height: '100%'}}
        key={viewPanel.id}
        panelInfo={{
          title: viewPanel.panelOptions.title,
          id: viewPanel.id
        }}
      >
        <NodeGraph
          {...viewPanel}
        />
      </GridPanel>
    )
  } else {
    retNode = (
      <>
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={90}
          width={1200}
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
              >
                <NodeGraph
                  {...panel}
                />
              </GridPanel>
            );
          })}
        </GridLayout>
      </>
    )
  }

  return retNode;
}

export default Dashboard;