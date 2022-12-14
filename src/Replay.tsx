import { useEffect, useRef, useState } from "react";
import { BackToMainMenu } from "./BackToMainMenu";
import { getSharedGame } from "./getSharedGame";
import { UseBoard } from "./useBoard";
import { useTranslation } from "./useTranslation";

export function Replay({
  board,
  startTime,
  finishTime,
  restartReplay,
  startReplay,
}: Pick<
  UseBoard,
  "board" | "startTime" | "finishTime" | "restartReplay" | "startReplay"
>) {
  const t = useTranslation();

  useEffect(() => {
    const sharedGame = getSharedGame();

    if (!sharedGame) {
      return;
    }

    startReplay(sharedGame);
  }, [startReplay]);

  const [replayPercentage, setReplayPercentage] = useState<number>();

  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animationStart = (e: AnimationEvent) => {
      if (e.animationName !== "scale-x") {
        return;
      }

      setReplayPercentage(0);
    };

    const animationEnd = (e: AnimationEvent) => {
      if (e.animationName !== "scale-x") {
        return;
      }

      setReplayPercentage(100);
    };

    addEventListener("animationstart", animationStart);
    addEventListener("animationend", animationEnd);

    return () => {
      removeEventListener("animationstart", animationStart);
      removeEventListener("animationend", animationEnd);
    };
  }, []);

  useEffect(() => {
    if (board?.some(({ state }) => state !== "hidden")) {
      return;
    }

    if (!progressRef.current) {
      return;
    }

    progressRef.current.classList.remove("animate-scale-x");

    // Trigger reflow to reset the animation
    void progressRef.current.offsetWidth;

    progressRef.current.classList.add("animate-scale-x");
  }, [board]);

  return (
    <div className="flex justify-between gap-4 p-4 pb-2">
      <BackToMainMenu hideLabel />
      <div className="flex flex-grow items-center">
        <span className="h-3 w-3 rounded-full bg-gray-300" />
        <span className="relative h-1 w-full bg-gray-500">
          <div
            className="absolute inset-0 origin-left bg-gray-200"
            ref={progressRef}
            style={{
              animationDuration:
                finishTime && startTime ? `${finishTime - startTime}ms` : "",
            }}
          ></div>
        </span>
        <span
          className={[
            "h-3 w-3 rounded-full",
            !replayPercentage || replayPercentage < 100
              ? "bg-gray-500"
              : "bg-gray-300",
          ].join(" ")}
        />
      </div>
      <button
        className="rounded border border-gray-300 bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-600"
        onClick={restartReplay}
        title={t("Restart replay")}
        type="button"
      >
        &#8634;
      </button>
    </div>
  );
}
