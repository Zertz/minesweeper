export type BoardConfiguration = {
  id: "Beginner" | "Intermediate" | "Expert";
  mines: number;
  seed?: number;
  x: number;
  y: number;
};

export type Cell = {
  id: string;
  neighbors: string[];
  order: number;
  state: "hidden" | "flag" | "visible";
  type: "mine" | "safe";
  value: number;
  x: number;
  y: number;
};
