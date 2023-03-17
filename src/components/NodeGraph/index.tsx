import React, {useEffect} from "react";
import G6, {Graph, GraphData, ModelConfig} from "@antv/g6";
import {DashboardPanel, graphDataLoader, judge} from "../../utils";
import {theme} from "antd";

const NodeGraph: React.FC<DashboardPanel> = (
  {
    gridPos: {
      w, h
    },
    panelOptions: {
      datasource,
      title,
      type
    },
    nodeOptions: {
      key = 'name',
      rules
    },
  }
) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const token = theme.useToken().token;

  const graph = React.useRef<Graph | null>(null);

  const defaultModel: ModelConfig = {
    size: 10,
    style: {
      fill: token.colorPrimaryBg
    }
  }

  useEffect(() => {
    if (!graph.current) {
      const toolBar = new G6.ToolBar();
      graph.current = new G6.Graph({
        container: ref.current as HTMLDivElement,
        width: ref.current?.clientWidth,
        height: ref.current?.clientHeight,
        layout: {
          type: 'force',
          // type: 'restricted-force-layout',
          linkDistance: 10,
          nodeStrength: -30,
          preventOverlap: true,
          nodeSize: 6,
          enableTick: true,
          alphaDecay: 0.028,
          alphaMin: 0.001,
          alpha: 0.3,
        },
        defaultNode: defaultModel,
        modes: {
          default: ['zoom-canvas', 'drag-canvas']
        },
        plugins: [toolBar],
      });
    }

    const time = 1;
    graphDataLoader.getData(datasource).then(value => {
      const processedData: GraphData = {
        nodes: value.nodes.filter(node => {
          return (node.start ?? -1) <= time && (node.end ?? Infinity) >= time;
        }).map(node => ({
          ...node,
          id: node[key] as string,
        })),
        edges: value.links.filter(link => {
          return (link.start ?? -1) <= time && (link.end ?? Infinity) >= time;
        }).map(link => ({
          ...link,
          id: link.id.toString(),
          source: link.source.toString(),
          target: link.target.toString(),
        }))
      };
      console.log(processedData)

      graph.current?.data(processedData);
      graph.current?.render();
      graph.current?.changeSize(ref.current?.clientWidth ?? 0, ref.current?.clientHeight ?? 0);
    });
  }, [key, datasource]);

  useEffect(() => {
    graph.current?.changeSize(ref.current?.clientWidth ?? 0, ref.current?.clientHeight ?? 0);
  }, [w, h]);

  useEffect(() => {
    const nodes = graph.current?.getNodes();
    console.log(key, rules)
    nodes?.forEach(node => {
      rules.forEach(rule => {
        if (rule?.fieldName === key) {
          // field name is id
          console.log(node)
          if (judge(rule.type, node._cfg?.model?.id, rule.value)) {
            graph.current?.updateItem(node.getID(), {
              ...node._cfg?.model,
              style: {
                ...node._cfg?.model?.style,
                fill: rule.config.lColor
              }
            });
          }
        } else {

        }
      });
    });
  }, [key, rules]);

  return (
    <div ref={ref} style={{height: '100%'}}>
    </div>
  )
}

function areEqual(prevProps: DashboardPanel, nextProps: DashboardPanel) {
  let equal = prevProps.panelOptions.datasource === nextProps.panelOptions.datasource
    && prevProps.nodeOptions.key === nextProps.nodeOptions.key
    && prevProps.gridPos.h === nextProps.gridPos.h
    && prevProps.gridPos.w === nextProps.gridPos.w;
  return false;
}

export default React.memo(NodeGraph, areEqual);
