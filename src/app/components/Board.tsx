import { FC } from "react";
import Square from "./Square";
import { CellType } from "./types";

type Props = {
  squares: number[][];
  cellTypes: CellType[];
  onClick: (x: number, y: number) => void;
};

const Board: FC<Props> = (props) => {
  const renderSquare = (x: number, y: number, value: number) => {
    return (
      <Square
        key={x + "," + y}
        top={y * 32}
        left={x * 32}
        value={value}
        onClick={() => props.onClick(x, y)}
        cellTypes={props.cellTypes}
      />
    );
  };

  const boardDom = [];
  for (let y = 0; y < props.squares.length; y++) {
    for (let x = 0; x < props.squares.length; x++) {
      boardDom.push(renderSquare(x, y, props.squares[y][x]));
    }
  }
  return <div>{boardDom}</div>;
};

export default Board;
