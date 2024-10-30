import { FC } from "react";
import { CellType } from "./types";

type Props = {
  value: number;
  top: number;
  left: number;
  cellTypes: CellType[];
  onClick: () => void;
};

const Square: FC<Props> = (props) => {
  return (
    <div
      className="square"
      style={{ top: props.top, left: props.left }}
      onClick={() => props.onClick()}
    >
      <div className="square-cell">
        <div className={"square-" + props.cellTypes[props.value]}></div>
      </div>
    </div>
  );
};

export default Square;
