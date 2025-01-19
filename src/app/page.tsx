"use client";

// import Image from "next/image";
import { AppContext, useGame } from "@/contexts/AppContext";
import Game from "./components/Game";

export default function Home() {
  const game = useGame();
  return (
    <div>
      <AppContext value={game}>
        <Game />
      </AppContext>
    </div>
  );
}
