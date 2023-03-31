import {ID, LinkDatum, NodeDatum} from "./types";

export function defaultId(node: NodeDatum) {
  if (node.id) {
    return node.id;
  } else {
    throw new Error('id is not provided and node.id is undefined!!');
  }
}

export function __adjacent_matrix(links: LinkDatum[], id: typeof defaultId = defaultId) {
  let adjacentMatrix: Record<ID, Record<ID, number>> = {};
  links.forEach(link => {
    let src = typeof link.source === 'object' ? id(link.source) : link.source;
    let tgt = typeof link.target === 'object' ? id(link.target) : link.target;

    if (!adjacentMatrix[src]) {
      adjacentMatrix[src] = {};
    }
    if (!adjacentMatrix[tgt]) {
      adjacentMatrix[tgt] = {};
    }

    adjacentMatrix[src][tgt] = 1;
    adjacentMatrix[tgt][src] = 1;
  });
  return adjacentMatrix;
}

export function __degree(adjacentMatrix: Record<ID, Record<ID, number>>) {
  let degree: Record<ID, number> = {};
  Object.keys(adjacentMatrix).forEach(key => {
    degree[key] = Object.keys(adjacentMatrix[key]).length;
  });
  return degree;
}

export function dijkstra(adjacentMatrix: Record<ID, Record<ID, number>>, start: ID) {
  // 到所有节点的距离
  let distances: Record<ID, number> = {};
  for (let node in adjacentMatrix) {
    distances[node] = Infinity;
  }
  distances[start] = 0;

  let queue: Array<ID> = [];
  queue.push(start);

  while (queue.length > 0) {
    let currentNode = queue.shift();
    if (currentNode !== undefined) {
      let neighbors = adjacentMatrix[currentNode];

      for (let neighbor in neighbors) {
        // 计算从起始节点到该相邻节点的距离
        let distance = distances[currentNode] + neighbors[neighbor];

        // 如果计算出来的距离比已有的距离更短，则更新距离
        if (distance < distances[neighbor]) {
          distances[neighbor] = distance;
          queue.push(neighbor);
        }
      }
    }
  }
  return distances;
}