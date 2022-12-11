export type Cell = {
  id: string;
  neighbors: string[];
  state: "hidden" | "flag" | "visible";
  type: "bomb" | "safe";
  value: number;
  x: number;
  y: number;
};
