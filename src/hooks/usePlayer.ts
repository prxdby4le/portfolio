import { useContext } from "react";
import { PlayerContext } from "@/contexts/player-context";

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
