import {Force} from "d3-force";
import {ID, LinkDatum, NodeDatum} from "../types";
import {defaultId, dis, jiggle} from "../algorithms/common";

function find(nodeById: Map<ID, NodeDatum>, nodeId: ID) {
  let node = nodeById.get(nodeId);
  if (!node) throw new Error("node not found: " + nodeId);
  return node;
}

function forceLinkDir(links: LinkDatum[]): Force<NodeDatum, LinkDatum> {
  let nodes: NodeDatum[];
  let id = defaultId;

  if (links == null) links = [];

  function force(alpha: number) {
    links.forEach(link => {
      let src = link.source;
      let tgt = link.target;
      if (typeof src === "object" && typeof tgt === 'object') {
        let prevSrc = src.prev;
        let prevTgt = tgt.prev;
        if (
          src.x && src.y && tgt.x && tgt.y &&
          prevSrc?.x && prevSrc.y && prevTgt?.x && prevTgt.y &&
          tgt.vx && tgt.vy
        ) {
          let prevX = prevTgt?.x - prevSrc?.x || jiggle();
          let prevY = prevTgt?.y - prevSrc?.y || jiggle();
          let x = tgt.x - src.x || jiggle();
          let y = tgt.y - tgt.x || jiggle();
          let delta = (Math.atan(prevY / prevX) - Math.atan(y / x)) / Math.PI * 2;
          let dx = tgt.x - prevTgt.x || jiggle();
          let dy = tgt.y - prevTgt.y || jiggle();
          let l = Math.sqrt(dx * dx + dy * dy);
          tgt.vx -= dx / l * delta * alpha;
          tgt.vy -= dy / l * delta * alpha;
        }
      }
    });
  }

  function initialize() {
    if (!nodes) return;

    let nodeById = new Map(nodes.map((d) => [id(d), d]));

    links.forEach(link => {
      if (typeof link.source !== "object") link.source = find(nodeById, link.source);
      if (typeof link.target !== "object") link.target = find(nodeById, link.target);
    });
  }

  force.initialize = function (_: NodeDatum[]) {
    nodes = _;
    initialize();
  }

  force.links = function(_: LinkDatum[]) {
    if (arguments.length) {
      links = _;
      initialize();
      return force;
    }
    return links;
  };

  force.id = function(_: typeof defaultId) {
    if (arguments.length) {
      id = _;
      return force;
    }
    return id;
  };

  return force;
}

export default forceLinkDir;