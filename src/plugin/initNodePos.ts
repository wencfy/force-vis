import {ID, LinkDatum, NodeDatum} from "./algorithms/types";

function defaultId(node: NodeDatum) {
  if (node.id) {
    return node.id;
  } else {
    throw new Error('id is not provided and node.id is undefined!!');
  }
}

function initNodePos(
  oldNodes: NodeDatum[],
  oldLinks: LinkDatum[],
  nodes: NodeDatum[],
  links: LinkDatum[],
  id: (node: NodeDatum) => ID = defaultId,
) {
  if (!oldNodes.length) {
    return;
  }
  const idFromEdge = (node: ID | NodeDatum): ID => {
    if (typeof node === 'object') {
      return id(node);
    } else {
      return node;
    }
  }

  nodes.forEach(node => {
    let i = 0;
    while (i < oldNodes.length) {
      if(id(oldNodes[i]) === id(node)) {
        // 原有的节点
        node.x = oldNodes[i].x;
        node.y = oldNodes[i].y;
        node.confidence = 1;

        // 将存在新增边的节点 confidence 设置为 .25
        let originalEdgeList: Array<ID> = [];
        let newEdgeList: Array<ID> = [];
        for (let x = 0; x < oldLinks.length; x++) {
          if (oldLinks[x].source === node.id) {
            originalEdgeList.push(idFromEdge(oldLinks[x].target));
          }
          if (oldLinks[x].target === node.id) {
            originalEdgeList.push(idFromEdge(oldLinks[x].source));
          }
        }
        for (let y = 0; y < links.length; y++) {
          if (links[y].source === node.id) {
            newEdgeList.push(idFromEdge(links[y].target));
          }
          if (links[y].target === node.id) {
            newEdgeList.push(idFromEdge(links[y].source));
          }
        }

        if (originalEdgeList.length === newEdgeList.length) {
          if (
            originalEdgeList.filter(edge => newEdgeList.includes(edge)).length
            !== originalEdgeList.length
          ) {
            node.confidence = 0.25;
          }
        } else {
          node.confidence = 0.25;
        }
        break;
      }
      i++;
    }

    if (i === oldNodes.length) {
      // 新增的节点
      let edgeList = links.reduce<Array<ID>>((edgeList, edge) => {
        if (edge.source === node.id) {
          return [ ...edgeList, idFromEdge(edge.target) ];
        } else if (edge.target === node.id) {
          return [ ...edgeList, idFromEdge(edge.source) ];
        } else {
          return edgeList;
        }
      }, []);

      let relatedOriginalNodeIds = edgeList.filter((nodeId) => {
        return oldNodes.find((n) => (id(n) === nodeId));
      })

      if (relatedOriginalNodeIds.length === 0) {
        let randIndex = Math.round(Math.random() * (oldNodes.length - 1));
        node.x = oldNodes[randIndex].x;
        node.y = oldNodes[randIndex].y;
        node.confidence = 0;
      } else if (relatedOriginalNodeIds.length === 1) {
        let fNode = oldNodes.find((node) => {
          return node.id === relatedOriginalNodeIds[0];
        })
        node.x = fNode?.x;
        node.y = fNode?.y;
        node.confidence = 0;
      } else if (relatedOriginalNodeIds.length > 1) {
        [node.x, node.y] = relatedOriginalNodeIds.reduce((prev, edge) => {
          let fNode = oldNodes.find((node) => {
            return node.id === edge;
          });
          return [
            prev[0] + (fNode?.x ?? 0) / relatedOriginalNodeIds.length,
            prev[1] + (fNode?.y ?? 0) / relatedOriginalNodeIds.length
          ];
        }, [0, 0]);
        node.confidence = 0.1;
      }
    }
    return node;
  });
}

export default initNodePos;