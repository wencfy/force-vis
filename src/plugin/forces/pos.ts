import {Force} from "d3-force";
import {LinkDatum, NodeDatum} from "../types";

function forcePos(): Force<NodeDatum, LinkDatum> {
  let nodes: NodeDatum[];

  function force(alpha: number) {
    nodes.forEach(node => {
      let prevNode = node.prev;
      if (prevNode && prevNode.x !== undefined && node.x !== undefined && prevNode.y !== undefined && node.y !== undefined && node.vx && node.vy) {
        let deltaVx = (prevNode.x - node.x) * alpha;
        let deltaVy = (prevNode.y - node.y) * alpha;
        node.vx += deltaVx;
        node.vy += deltaVy;
      }
    });
  }

  force.initialize = function (_: NodeDatum[]) {
    nodes = _;
  }

  return force;
}

export default forcePos;