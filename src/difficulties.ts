import { BoardConfiguration } from "./types";

export const difficulties: Omit<BoardConfiguration, "seed" | "type">[] = [
  {
    id: "Beginner",
    mines: 10,
    x: 8,
    y: 8,
  },
  {
    id: "Intermediate",
    mines: 40,
    x: 16,
    y: 16,
  },
  {
    id: "Expert",
    mines: 99,
    x: 30,
    y: 16,
  },
];
