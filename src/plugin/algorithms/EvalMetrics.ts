import {ID, LinkDatum, NodeDatum} from "../types";
import {__adjacent_matrix, defaultId, dijkstra, dis} from "./common";

interface GraphState {
  nodes: NodeDatum[];
  links: LinkDatum[];
}

class EvalMetrics {
  private prevState: GraphState | null;
  private readonly state: GraphState;
  private readonly distance: number;
  private shortestPathMatrix: Record<ID, Record<ID, number>> = {};
  private readonly adjacentMatrix: Record<ID, Record<ID, number>>;
  private readonly id;

  constructor(
    state: GraphState,
    distance: number,
    prevState?: GraphState,
    id: (node: NodeDatum) => ID = defaultId,
  ) {
    this.state = state;
    this.distance = distance;
    this.prevState = prevState ?? null;
    this.id = id;

    this.adjacentMatrix = __adjacent_matrix(this.state.links, id);
    for (let node in this.adjacentMatrix) {
      this.shortestPathMatrix[node] = dijkstra(this.adjacentMatrix, node);
    }
  }

  energy() {
    let e = 0;
    const {nodes} = this.state;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const sp = this.shortestPathMatrix[this.id(nodes[i])][this.id(nodes[j])]
        if (sp) {
          e += Math.pow(dis(nodes[i], nodes[j]) - sp * this.distance, 2);
        }
      }
    }
    return e;
  }

  deltaPos() {
    let delta = 0;
    let prevNodesMap: Record<ID, NodeDatum> = {};
    this.prevState?.nodes?.forEach(node => {
      prevNodesMap[this.id(node)] = node;
    });
    this.state.nodes.forEach(node => {
      let prevNode = prevNodesMap[this.id(node)];
      if (prevNode) {
        delta += dis(node, prevNode);
      }
    });
    return delta;
  }

  deltaLen() {
    let delta = 0;
    let prevLinksMap: Record<ID, LinkDatum> = {};
    this.prevState?.links?.forEach(link => {
      prevLinksMap[link.id] = link;
    });

    this.state.links.forEach(link => {
      let prevLink = prevLinksMap[link.id];
      if (prevLink) {
        delta += Math.abs(dis(link.startPoint, link.endPoint) - dis(prevLink.startPoint, prevLink.endPoint));
      }
    });
    return delta;
  }

  deltaDir() {
    let delta = 0;
    let prevNodesMap: Record<ID, NodeDatum> = {};
    this.prevState?.nodes?.forEach(node => {
      prevNodesMap[this.id(node)] = node;
    });
    this.state.nodes.forEach(nodeI => {
      this.state.nodes.forEach(nodeJ => {
        let prevNodeI = prevNodesMap[this.id(nodeI)];
        let prevNodeJ = prevNodesMap[this.id(nodeJ)];
        if (prevNodeI && prevNodeJ) {
          if (nodeI.x && nodeJ.x && prevNodeI.x && prevNodeJ.x) {
            delta += Math.abs((prevNodeI.x - prevNodeJ.x) - (nodeI.x - nodeJ.x));
          }
          if (nodeI.y && nodeJ.y && prevNodeI.y && prevNodeJ.y) {
            delta += Math.abs((prevNodeI.y - prevNodeJ.y) - (nodeI.y - nodeJ.y));
          }
        }
      });
    });
    return delta / 2;
  }

  deltaOrth() {
    let delta = 0;
    let prevNodesMap: Record<ID, NodeDatum> = {};
    this.prevState?.nodes?.forEach(node => {
      prevNodesMap[this.id(node)] = node;
    });
    this.state.nodes.forEach(nodeI => {
      this.state.nodes.forEach(nodeJ => {
        let prevNodeI = prevNodesMap[this.id(nodeI)];
        let prevNodeJ = prevNodesMap[this.id(nodeJ)];
        if (prevNodeI && prevNodeJ) {
          if (nodeI.x && nodeJ.x && prevNodeI.x && prevNodeJ.x) {
            if ((prevNodeI.x - prevNodeJ.x) * (nodeI.x - nodeJ.x) < 0) {
              delta++;
            }
          }
          if (nodeI.y && nodeJ.y && prevNodeI.y && prevNodeJ.y) {
            if ((prevNodeI.y - prevNodeJ.y) * (nodeI.y - nodeJ.y) < 0) {
              delta++;
            }
          }
        }
      });
    });
    return delta / 2;
  }

  all() {
    return {
      energy: this.energy(),
      deltaPos: this.deltaPos(),
      deltaLen: this.deltaLen(),
      deltaDir: this.deltaDir(),
      deltaOrth: this.deltaOrth()
    }
  }
}

export default EvalMetrics;