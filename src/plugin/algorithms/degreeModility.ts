import {scaleLinear} from "d3-scale";
import {ID, LinkDatum, NodeDatum} from "../types";
import {__adjacent_matrix, __degree, defaultId} from "./common";

function degreeMobility(
  oldNodes: NodeDatum[],
  oldLinks: LinkDatum[],
  nodes: NodeDatum[],
  links: LinkDatum[],
  id: (node: NodeDatum) => ID = defaultId,
) {
  let adjacentMatrix = __adjacent_matrix(links, id);
  let degree = __degree(adjacentMatrix);

  const [minE, maxE] = Object.values<number>(degree).reduce<[number, number]>(
    ([minE, maxE], d) => [Math.min(minE, d), Math.max(maxE, d)],
    [Infinity, -Infinity]
  );

  if (maxE !== 0) {
    const linear = scaleLinear().domain([minE, maxE]).range([0.6, 1]);
    nodes.forEach(node => node.mobility = linear(degree[id(node)]));
  } else {
    nodes.forEach(node => node.mobility = 1);
  }
}

export default degreeMobility;