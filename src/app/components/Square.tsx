import { FC, use } from "react";
import { cellTypes } from "@/const/const";
import { AppContext } from "@/contexts/AppContext";

type Props = {
  value: number;
  x: number;
  y: number;
};

const Square: FC<Props> = ({ value, x, y }) => {
  const { selectCell } = use(AppContext);

  return (
    <div
      className="square"
      style={{ top: y * 32, left: x * 32 }}
      onClick={() => selectCell(x, y)}
    >
      <div className="square-cell">
        <div className={"square-" + cellTypes[value]}></div>
      </div>
    </div>
  );
};

export default Square;
