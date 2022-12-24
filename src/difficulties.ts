import { BoardConfiguration } from "./types";

export const difficulties: Omit<BoardConfiguration, "id" | "seed" | "type">[] =
  [
    {
      difficulty: "Beginner",
      mines: 10,
      x: 8,
      y: 8,
    },
    {
      difficulty: "Intermediate",
      mines: 40,
      x: 16,
      y: 16,
    },
    {
      difficulty: "Expert",
      mines: 99,
      x: 30,
      y: 16,
    },
  ];
