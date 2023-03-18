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
  console.log('NodeGraph() called');
  const ref = React.useRef<HTMLDivElement>(null);
  const {token} = theme.useToken();

  const graph = React.useRef<Graph | null>(null);

  const [defaultNodeModel, defaultEdgeModel]: [ModelConfig, ModelConfig] = [
    {
      size: 10,
      style: {
        fill: token.colorInfoBg,
        stroke: token.colorInfoBorderHover
      }
    },
    {
      style: {
        stroke: token.colorBorder
      }
    }
  ];

  function applyRules() {
    const nodes = graph.current?.getNodes();
    nodes?.forEach(node => {
      let set: boolean = false;

      rules.forEach(rule => {
        if (rule?.fieldName === key) {
          // field name is id
          if (judge(rule.type, node.getID(), rule.value)) {
            console.log(node)
            set = true;
            node.update({
              ...defaultNodeModel,
              style: {
                ...defaultNodeModel.style,
                fill: rule.config.lColor
              }
            });
          }
        } else {

        }
      });

      if (!set) {
        node.update({...defaultNodeModel});
      }
    });
    graph.current?.getEdges().forEach(edge => {
      edge.update({...defaultEdgeModel});
    });
  }

  useEffect(() => {
    graph.current?.changeSize(ref.current?.clientWidth ?? 0, ref.current?.clientHeight ?? 0);
  }, [w, h]);

  useEffect(applyRules, [defaultNodeModel, defaultEdgeModel, key, rules]);

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
        modes: {
          default: ['zoom-canvas', 'drag-canvas']
        },
        plugins: [toolBar],
      });
    }

    const time = 3;
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
      applyRules();
      graph.current?.changeSize(ref.current?.clientWidth ?? 0, ref.current?.clientHeight ?? 0);
    });
  }, [key, datasource]);

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
