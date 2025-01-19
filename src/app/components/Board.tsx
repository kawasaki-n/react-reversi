import { FC, use } from "react";
import Square from "./Square";
import { AppContext } from "@/contexts/AppContext";

const Board: FC = () => {
  const { squares } = use(AppContext);

  return (
    <>
      {squares.map((row, y) => {
        return row.map((cell, x) => {
          return <Square key={y + "," + x} x={x} y={y} value={cell} />;
        });
      })}
    </>
  );
};

export default Board;
