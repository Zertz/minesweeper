import { z } from "zod";

const BoardConfigurationSchema = z.object({
  id: z.string(),
  difficulty: z.enum(["Beginner", "Intermediate", "Expert"]),
  mines: z.number(),
  seed: z.number(),
  type: z.enum(["daily", "random", "replay"]),
  x: z.number(),
  y: z.number(),
});

export type BoardConfiguration = z.infer<typeof BoardConfigurationSchema>;

export const StoredGameResult = z.object({
  actions: z.preprocess(
    (actions) => {
      if (typeof actions !== "string") {
        return actions;
      }

      return actions.split("_").map((action) => {
        const [type, id, elapsedTime] = action.split("-");

        return {
          type: type === "f" ? "flagCell" : type === "r" ? "revealCell" : null,
          payload: { id },
          elapsedTime: Number(elapsedTime),
        };
      });
    },
    z.array(
      z.object({
        type: z.enum(["flagCell", "revealCell"]),
        payload: z.object({ id: z.string() }),
        elapsedTime: z.number().min(0),
      })
    )
  ),
  boardConfiguration: BoardConfigurationSchema,
  startDate: z.string(),
  startTime: z.number(),
  finishTime: z.number(),
});

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
