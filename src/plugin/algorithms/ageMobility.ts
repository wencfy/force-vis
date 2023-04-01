import {ID, LinkDatum, NodeDatum} from "./types";
import {__adjacent_matrix, defaultId} from "./common";

function ageMobility(
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

  nodes.forEach(node => {
    if (node.age === undefined) {
      node.age = 1;
    }
  });

  let adjacentMatrix = __adjacent_matrix(links, id);

  if (!isInit) {
    let sum = 0;
    let unchangedSum = 0;
    nodes.forEach(nodeI => {
      nodes.forEach(nodeJ => {
        if (adjacentMatrix[id(nodeI)][id(nodeJ)]) {
          sum += nodeJ.age;
          if (oldNodesById[id(nodeJ)]) {
            unchangedSum += nodeJ.age;
          }
        }
      });
      nodeI.age = nodeI.age * (unchangedSum / sum) + 1;
    });
  }

  nodes.forEach(node => {
    node.mobility = Math.pow(Math.E, -node.age);
  });
}

export default ageMobility;