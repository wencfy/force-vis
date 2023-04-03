import {ID, LinkDatum, NodeDatum} from "./types";
import {__adjacent_matrix, __degree, defaultId, idFromEdge} from "./common";

function pinningWeightMobility(
  oldNodes: NodeDatum[],
  oldLinks: LinkDatum[],
  nodes: NodeDatum[],
  links: LinkDatum[],
  id: (node: NodeDatum) => ID = defaultId,
) {
  let isInit = false;
  if (!oldNodes.length && !oldLinks.length) {
    isInit = true;
  }

  let oldNodesById: Record<ID, NodeDatum> = {};
  let oldLinksById: Record<string, LinkDatum> = {};

  // 两个 map 用来保存原有的节点和连边
  oldNodes.forEach(node => {
    oldNodesById[id(node)] = node;
  });
  oldLinks.forEach(link => {
    oldLinksById[link.id] = link;
  });

  let adjacentMatrix = __adjacent_matrix(links, id);
  let degree = __degree(adjacentMatrix);

  // initialize pinning weight of nodes
  nodes.forEach(nodeI => {
    nodeI.pinWeight = 0.6 * nodeI.confidence;
    nodes.forEach(nodeJ => {
      if (adjacentMatrix[id(nodeI)][id(nodeJ)]) {
        nodeI.pinWeight += (1 - 0.6) / degree[id(nodeI)] * nodeJ.confidence;
      }
    });
  });

  let disSet: Array<Array<NodeDatum>> = [];
  let visited: Record<ID, boolean> = {};
  let dPrev: Array<NodeDatum> = [];
  let dCurr: Array<NodeDatum>;
  let d0Node: Record<ID, boolean> = {};
  links.forEach(link => {
    if (!oldLinksById[link.id]) {
      d0Node[idFromEdge(link.source)] = true;
      d0Node[idFromEdge(link.target)] = true;
    }
  });

  // initialize of dPrev
  nodes.forEach(node => {
    if (d0Node[id(node)] || node.pinWeight < 1) {
      dPrev.push(node);
      visited[id(node)] = true;
    }
  });
  disSet.push(dPrev);

  while (true) {
    // initialize of dCurr
    dCurr = [];
    dPrev.forEach(d => {
      nodes.forEach(node => {
        if (adjacentMatrix[id(d)][id(node)] && !visited[id(node)]) {
          dCurr.push(node);
          visited[id(node)] = true;
        }
      });
    });
    if (dCurr.length) {
      disSet.push(dCurr);
      dPrev = dCurr;
    } else {
      break;
    }
  }

  const dMax = disSet.length;
  const dCutoff = 0.5 * dMax;
  disSet.forEach((d, i) => {
    if (i >= dCutoff) {
      d.forEach(node => {
        // node.pinWeight = 1;
        node.mobility = 1;
      });
    } else {
      d.forEach(node => {
        // node.pinWeight = Math.pow(0.35, 1 - i / dCutoff);
        node.mobility = Math.pow(0.35, 1 - i / dCutoff);
      });
    }
  });
}

export default pinningWeightMobility;