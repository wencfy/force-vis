import {Force} from "d3-force";
import {NodeDatum} from "../types";

export default function (
  x: number,
  y: number
): Force<NodeDatum, any> {
  let nodes: NodeDatum[] = [];
  let prevNodes: NodeDatum[] | null = null;

  if (!x) x = 0;
  if (!y) y = 0;

  function force(alpha: number) {

  }

  force.initialize = function (_: NodeDatum[]) {
    nodes = _;
  }

  force.prevNodes = function (_?: NodeDatum[]) {
    if (arguments.length && _) {
      prevNodes = _;
      return force;
    } else {
      return prevNodes;
    }
  }

  return force;
}