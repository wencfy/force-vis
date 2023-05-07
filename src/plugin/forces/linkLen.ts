import {Force} from "d3-force";
import {ID, LinkDatum, NodeDatum} from "../types";
import {defaultId, dis, jiggle} from "../algorithms/common";

function find(nodeById: Map<ID, NodeDatum>, nodeId: ID) {
  let node = nodeById.get(nodeId);
  if (!node) throw new Error("node not found: " + nodeId);
  return node;
}

function forceLinkLen(links: LinkDatum[]): Force<NodeDatum, LinkDatum> {
  let nodes: NodeDatum[];
  let id = defaultId;
  let distances: Record<ID, number> = {};

  if (links == null) links = [];

  function force(alpha: number) {
    links.forEach(link => {
      let src = link.source;
      let tgt = link.target;
      if (typeof src === "object" && typeof tgt === 'object') {
        if (distances[link.id]) {
          if (
            src.x && src.y && tgt.x && tgt.y &&
            src.vx && src.vy && tgt.vx && tgt.vy
          ) {
            let x = tgt.x + tgt.vx - src.x - src.vx || jiggle();
            let y = tgt.y + tgt.vy - src.y - src.vy || jiggle();
            let l = Math.sqrt(x * x + y * y);
            l = (l - distances[link.id]) / l * alpha;
            x *= l;
            y *= l;
            tgt.vx -= x * 0.5;
            tgt.vy -= y * 0.5;
            src.vx += x * 0.5;
            src.vy += y * 0.5;
          }
        }
      }
    });
  }

  function initializeDistance() {
    if (!nodes) return;

    links.forEach(link => {
      let src = link.source;
      let tgt = link.target;
      if (typeof src === "object" && typeof tgt === 'object') {
        let prevSrc = src.prev;
        let prevTgt = tgt.prev;
        distances[link.id] = dis(prevSrc ?? {}, prevTgt ?? {});
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

    distances = {};
    initializeDistance();
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

export default forceLinkLen;