import React, {useState} from "react";
import {ColorPicker, FilePicker} from "../components";
import {quadtree} from "d3-quadtree";

const nodes = [
  {
    "name": "6652258.com",
    "type": "Domain",
    "id": "6652258.com",
    "start": 1,
    "end": 19,
    "style": {
      "fill": "#fde2c8",
      "stroke": "#ffaa39"
    },
    "x": 33.150000000000006,
    "y": 34.20000000000002,
    "size": 10,
    "layoutOrder": 0,
    "index": 0,
    "vy": 0,
    "vx": 0
  },
  {
    "name": "www.6652258.com",
    "type": "Domain",
    "id": "www.6652258.com",
    "start": 1,
    "end": 19,
    "style": {
      "fill": "#e6f4ff",
      "stroke": "#69b1ff"
    },
    "x": 408.85,
    "y": 34.20000000000002,
    "size": 10,
    "layoutOrder": 0,
    "index": 1,
    "vy": 0,
    "vx": 0
  },
  {
    "name": "5.180.97.54",
    "type": "IP",
    "id": "5.180.97.54",
    "start": 1,
    "end": 19,
    "style": {
      "fill": "#e6f4ff",
      "stroke": "#69b1ff"
    },
    "x": 33.150000000000006,
    "y": 421.79999999999995,
    "size": 10,
    "layoutOrder": 0,
    "index": 2,
    "vy": 0,
    "vx": 0
  },
  {
    "name": "2a8cd6062e0ae1cbf435766d6ea0e4c269047ccc074c29a7499aa92790929d2c",
    "type": "Cert_SHA256",
    "id": "2a8cd6062e0ae1cbf435766d6ea0e4c269047ccc074c29a7499aa92790929d2c",
    "start": 1,
    "end": 19,
    "style": {
      "fill": "#e6f4ff",
      "stroke": "#69b1ff"
    },
    "x": 408.85,
    "y": 421.79999999999995,
    "size": 10,
    "layoutOrder": 0,
    "index": 3,
    "vy": 0,
    "vx": 0
  }
];
const Test = function () {
  const quad = quadtree(
    nodes, d => d.x, d => d.y
  );
  console.log(quad);

  return (
    <>
    </>
  )
}
export default Test;