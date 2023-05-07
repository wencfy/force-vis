import React, {useEffect, useRef, useState} from "react";
import {Button, Space, Tag, theme} from "antd";
import G6, {Graph, GraphData, ModelConfig} from "@antv/g6";
import {
  Download,
  FitScreen,
  NavigateBefore, NavigateNext,
  OneXMobiledata,
  Timer,
  ZoomIn,
  ZoomOut
} from "@styled-icons/material-outlined";
import {FieldTimeOutlined} from "@ant-design/icons/lib/icons";
import {SyncOutlined} from '@ant-design/icons';
import {DashboardPanel, graphDataLoader, judge} from "../../utils";
import {InfoWrapper, ViewControl} from "./style";
import {
  ageMobility,
  degreeMobility,
  EvalMetrics,
  LinkDatum,
  markovMobility,
  NodeDatum,
  pinningWeightMobility
} from "../../plugin";
import initNodePos from "../../plugin/initNodePos";

const constants = {
  type: 'restricted-force-layout',
  linkDistance: 50,
  nodeStrength: -30,
  preventOverlap: true,
  nodeSize: 3,
  enableTick: true,
  alphaDecay: 1 - Math.pow(0.001, 1 / 150),
  alphaMin: 0.001,
  alpha: 0.3,
}

const NodeGraph: React.FC<
  DashboardPanel & {
  updatePanel: ({id, newPanel, toDb}: { id: string, newPanel?: DashboardPanel, toDb?: boolean }) => void
}
> = (
  {
    id,
    gridPos: {
      w, h
    },
    panelOptions: {
      datasource,
      algorithm,
      title,
    },
    nodeOptions: {
      key = 'name',
      rules
    },
    updatePanel,
  }
) => {
  console.log('NodeGraph() called');
  if (key.trim() === '') {
    key = 'name';
  }
  const ref = React.useRef<HTMLDivElement>(null);
  const {token, theme: {id: isDark}} = theme.useToken();

  const graph = React.useRef<Graph | null>(null);
  const startTime = React.useRef<number>(0);
  const [timeUsage, setTimeUsage] = useState<number>(-1);
  const [time, setTime] = useState<number>(1);
  const [timeRestriction, setTimeRestriction] = useState(Infinity);

  const [defaultNodeModel, defaultEdgeModel]: [ModelConfig, ModelConfig] = [
    {
      size: 3,
      style: {
        fill: token.colorInfoBg,
        stroke: token.colorInfoBorderHover
      }
    },
    {
      style: {
        // stroke: '#333'
        stroke: token.colorBorder
      }
    }
  ];

  const prevState = useRef<{ nodes: NodeDatum[], edges: LinkDatum[] }>({nodes: [], edges: []});
  const metrics = useRef<Array<{
    time: number;
    energy: number;
    deltaPos: number;
    deltaLen: number;
    deltaDir: number;
    deltaOrth: number;
  }>>([]);

  function parseValue(value: string | undefined) {
    if (value?.at(0) === '$') {
      return {
        $time: time,
      }[value];
    } else {
      return value;
    }
  }

  function applyRules() {
    const nodes = graph.current?.getNodes();
    nodes?.forEach(node => {
      let set: boolean = false;

      rules.forEach(rule => {
        if (rule?.fieldName === key) {
          // field name is id
          if (judge(node.getID(), parseValue(rule.value), rule.type)) {
            set = true;
            node.update({
              ...defaultNodeModel,
              size: rule.config?.size ?? defaultNodeModel.size,
              style: {
                ...defaultNodeModel.style,
                fill: rule.config?.lColor,
                stroke: rule.config?.lStroke,
              }
            });
          }
        } else {
          if (judge(node?._cfg?.model?.[rule?.fieldName ?? 0], parseValue(rule?.value), rule?.type)) {
            set = true;
            node.update({
              ...defaultNodeModel,
              size: rule.config?.size ?? defaultNodeModel.size,
              style: {
                ...defaultNodeModel.style,
                fill: rule.config?.lColor,
                stroke: rule.config?.lStroke
              }
            });
          }
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
    if (['node distance', 'node position', 'link length', 'link direction'].find((alg) => alg === algorithm) && graph.current) {
      graph.current?.updateLayout({
        type: {
          'node distance': 'restricted-node-distance-force-layout',
          'node position': 'restricted-node-position-force-layout',
          'link length': 'restricted-link-length-force-layout',
          'link direction': 'restricted-link-direction-force-layout',
        }[algorithm] ?? 'restricted-force-layout',
      });
      graph.current?.refresh();
    }
  }, [algorithm]);

  useEffect(() => {
    if (!(graph.current || !ref.current?.clientHeight)) {
      graph.current = new G6.Graph({
        container: ref.current as HTMLDivElement,
        width: ref.current?.clientWidth,
        height: ref.current?.clientHeight,
        layout: {
          ...constants,
          type: {
            'node distance': 'restricted-node-distance-force-layout',
            'node position': 'restricted-node-position-force-layout',
            'link length': 'restricted-link-length-force-layout',
            'link direction': 'restricted-link-direction-force-layout',
          }[algorithm] ?? 'restricted-force-layout',
          onLayoutEnd: () => {
            console.log('onLayoutEnd()', graph.current);
            let res: {
              time: number;
              energy: number;
              deltaPos: number;
              deltaLen: number;
              deltaDir: number;
              deltaOrth: number;
            };
            const time = Date.now() - startTime.current;
            setTimeUsage(time);
            const {edges: oldEdges, nodes: oldNodes} = prevState.current;
            const {edges, nodes} = (graph.current?.save() ?? {edges: [], nodes: []}) as unknown as {
              edges: LinkDatum[],
              nodes: NodeDatum[],
            }
            // apply metrics
            // res = {
            //   time: time,
            //   ...(new EvalMetrics(
            //     {nodes, links: edges},
            //     constants.linkDistance,
            //     {nodes: oldNodes, links: oldEdges}
            //   )).all()
            // }
            // metrics.current.push(res);
            // console.log(metrics.current);
          }
        },
        modes: {
          default: ['zoom-canvas', 'drag-canvas']
        },
      });
    }

    if (datasource && datasource !== '') {
      graphDataLoader.getData(datasource).then(value => {
        setTimeRestriction(value.nodes.reduce((max, node) => {
          if (max < node.end) {
            max = node.end;
          }
          return max;
        }, -1));
        const processedData: GraphData = {
          nodes: value.nodes.filter(node => {
            return (node.start ?? -1) <= time && (node.end ?? Infinity) >= time;
          }).map(node => ({
            ...node,
            id: node[key] as string,
            ...graph.current?.findById(node[key])?._cfg?.model
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

        prevState.current = (graph.current?.save() ?? {edges: [], nodes: []}) as unknown as {
          edges: LinkDatum[],
          nodes: NodeDatum[],
        };
        const {edges: oldEdges, nodes: oldNodes} = prevState.current;
        const {edges, nodes} = processedData as unknown as {
          edges: LinkDatum[],
          nodes: NodeDatum[],
        };
        initNodePos(oldNodes, oldEdges, nodes, edges);
        // apply algorithms
        switch (algorithm) {
          case 'markov mobility':
            markovMobility(oldNodes, oldEdges, nodes, edges);
            break;
          case 'degree mobility':
            degreeMobility(oldNodes, oldEdges, nodes, edges);
            break;
          case 'age mobility':
            ageMobility(oldNodes, oldEdges, nodes, edges);
            break;
          case 'pinning weight mobility':
            pinningWeightMobility(oldNodes, oldEdges, nodes, edges);
            break;
          default:

        }
        graph.current?.data(processedData);

        startTime.current = Date.now();
        setTimeUsage(-1);

        graph.current?.render();
        applyRules();
        graph.current?.changeSize(ref.current?.clientWidth ?? 0, ref.current?.clientHeight ?? 0);
      });
    } else {
      setTimeUsage(0);
    }
  }, [key, datasource, time, ref.current?.clientHeight, algorithm]);

  return (
    <div ref={ref} style={{height: '100%'}}>
      <ViewControl>
        <InfoWrapper>
          {timeUsage === -1 ?
            <Tag icon={<SyncOutlined spin/>} color="processing">
              rendering
            </Tag> :
            <Tag icon={<Timer size={16}/>} color="success">
              {timeUsage} ms
            </Tag>}
          <Tag icon={<FieldTimeOutlined/>}>
            {time}
          </Tag>
        </InfoWrapper>
        <Space wrap>
          <Button
            size="small"
            type="text"
            icon={<ZoomIn size={18}/>}
            onClick={() => {
              graph.current?.zoom(1.1, graph.current?.getGraphCenterPoint());
            }}
          />
          <Button
            size="small"
            type="text"
            icon={<ZoomOut size={18}/>}
            onClick={() => {
              graph.current?.zoom(0.9, graph.current?.getGraphCenterPoint());
            }}
          />
          <Button
            size="small"
            type="text"
            icon={<FitScreen size={18}/>}
            onClick={() => {
              graph.current?.fitView();
            }}
          />
          <Button
            size="small"
            type="text"
            icon={<OneXMobiledata size={18}/>}
            onClick={() => {
              graph.current?.zoomTo(1, graph.current?.getGraphCenterPoint());
            }}
          />
          <Button
            size="small"
            type="text"
            icon={<Download size={18}/>}
            onClick={() => {
              graph.current?.downloadFullImage();
            }}
          />
          <Button
            size="small"
            type="text"
            disabled={time <= 1}
            icon={<NavigateBefore size={18}/>}
            onClick={() => {
              setTime(time - 1);
            }}
          />
          <Button
            size="small"
            type="text"
            disabled={time >= timeRestriction}
            icon={<NavigateNext size={18}/>}
            onClick={() => {
              setTime(time + 1);
            }}
          />
        </Space>
      </ViewControl>
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
