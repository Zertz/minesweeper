export type BoardConfiguration = {
  id: "Beginner" | "Intermediate" | "Expert";
  mines: number;
  seed: number;
  type: "daily" | "random" | "replay";
  x: number;
  y: number;
};

export type Cell = {
  id: string;
  index: number;
  neighbors: string[];
  state: "hidden" | "flag" | "visible";
  type: "mine" | "safe";
  value: number;
  x: number;
  y: number;
};
