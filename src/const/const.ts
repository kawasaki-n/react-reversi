import { CellType } from "@/app/components/types";

export const cellTypes: CellType[] = ["empty", "black", "white", "puttable"];

export const initSquares: number[][] = Array(8)
  .fill(0)
  .map(() => Array(8).fill(0));
initSquares[3][3] = 1;
initSquares[4][4] = 1;
initSquares[3][4] = 2;
initSquares[4][3] = 2;
