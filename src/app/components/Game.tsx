import { FC, use } from "react";
import Board from "./Board";
import { AppContext } from "@/contexts/AppContext";

const Game: FC = () => {
  const { msg, initialize } = use(AppContext);

  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <p className="prose font-bold">{msg}</p>
        <br />
        <button
          onClick={() => initialize()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          もう一度
        </button>
      </div>
    </div>
  );
};

export default Game;
