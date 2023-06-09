import {SimulationLinkDatum, SimulationNodeDatum} from "d3-force";

export type ID = string | number;

export interface NodeDatum extends SimulationNodeDatum {
  id?: ID;
  pos: number;
  mobility: number;
  mov: number;
  confidence: number;
  age: number;
  pinWeight: number;
  prev?: NodeDatum;
}

export interface LinkDatum<N extends NodeDatum = NodeDatum> extends SimulationLinkDatum<N> {
  id: ID;
  startPoint: N;
  endPoint: N;
}