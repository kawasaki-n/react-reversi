"use client";

import { initSquares } from "@/const/const";
import { createContext, useCallback, useState } from "react";

export type GameInfo = {
  msg: string;
  turn: number;
  squares: number[][];
  initialize: () => void;
  selectCell: (x: number, y: number) => void;
};

export const AppContext = createContext<GameInfo>({
  msg: "",
  turn: 1,
  squares: [],
  initialize: () => {},
  selectCell: () => {},
});

export const useGame = (): GameInfo => {
  const [turn, setTurn] = useState<number>(1);
  const [squares, setSquares] = useState<number[][]>(
    structuredClone(initSquares)
  );
  const [msg, setMsg] = useState<string>("あなた（黒）の手番です。");

  /**
   * 盤面を初期化する
   */
  const initialize = useCallback(() => {
    setTurn(1);
    setSquares(structuredClone(initSquares));
    setMsg("あなた（黒）の手番です。");
  }, []);

  /**
   * コマを置いた場所から裏返せるコマを探す
   */
  const findFlipableCells = useCallback(
    (x: number, y: number, t: number, nextSquares: number[][]) => {
      let ret: number[][] = [];
      // コマを置く場所から周囲8方向を探索
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dy === 0 && dx === 0) continue;

          let nx = x + dx;
          let ny = y + dy;

          const tempFlipables: number[][] = [];

          while (nextSquares[ny] && nextSquares[ny][nx] === 3 - t) {
            tempFlipables.push([nx, ny]);
            nx += dx;
            ny += dy;
          }
          if (nextSquares[ny] && nextSquares[ny][nx] === t) {
            ret = ret.concat(tempFlipables);
          }
        }
      }
      return ret;
    },
    []
  );

  /**
   * コマを置ける場所かを判定する
   */
  const validate = useCallback(
    (x: number, y: number, t: number, nextSquares: number[][]): boolean => {
      // すでにコマが置かれている場合は置けない
      if (nextSquares[y][x] === 1 || nextSquares[y][x] === 2) {
        return false;
      }
      const flipableCells = findFlipableCells(x, y, t, nextSquares);
      return flipableCells.length > 0;
    },
    [findFlipableCells]
  );

  /**
   * コマを裏返す
   */
  const flip = useCallback(
    (x: number, y: number, currentTurn: number, nextSquares: number[][]) => {
      const flipablesCells = findFlipableCells(x, y, currentTurn, nextSquares);
      flipablesCells.forEach(([x, y]) => {
        nextSquares[y][x] = currentTurn;
      });
      nextSquares[y][x] = currentTurn;
    },
    [findFlipableCells]
  );

  /**
   * 手番を変更する
   */
  const changeTurn = useCallback(
    (turn: number, nextSquares: number[][]) => {
      const nextTurn = 3 - turn;
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          if (validate(x, y, nextTurn, nextSquares)) {
            return nextTurn;
          }
        }
      }
      // パス（手番を再度変更し、置ける場所があるかチェックする）
      const cunnrentTurn = turn;
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          if (validate(x, y, cunnrentTurn, nextSquares)) {
            return cunnrentTurn;
          }
        }
      }
      // ゲーム終了（両者ともにおける場所がない）
      return 0;
    },
    [validate]
  );

  /**
   * コマを置ける場所をハイライトする
   */
  const highlightPuttableCells = useCallback(
    (turn: number, nextSquares: number[][]): void => {
      if (turn === 0) {
        return;
      }

      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          if (nextSquares[y][x] === 1 || nextSquares[y][x] === 2) {
            continue;
          }
          if (validate(x, y, turn, nextSquares)) {
            nextSquares[y][x] = 3;
          } else {
            nextSquares[y][x] = 0;
          }
        }
      }
    },
    [validate]
  );

  /**
   * 勝敗を判定する
   */
  const judgeWinner = useCallback((nextSquares: number[][]) => {
    let result = "";
    let blackCount = 0;
    let whiteCount = 0;
    nextSquares.map((row) => {
      row.map((cell) => {
        if (cell === 1) {
          blackCount++;
        } else if (cell === 2) {
          whiteCount++;
        }
      });
    });
    if (blackCount > whiteCount) {
      result = "あなた（黒）の勝ちです。";
    } else if (blackCount < whiteCount) {
      result = "コンピュータ（白）の勝ちです。";
    } else {
      result = "引き分けです。";
    }
    setMsg(result + " (黒: " + blackCount + " 白: " + whiteCount + ")");
  }, []);

  /**
   * どの場所に置くとどの場所を裏返せるかを計算する
   */
  const calculatePuttable = useCallback(
    (turn: number, nextSquares: number[][]) => {
      const ret = [];
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          if (validate(x, y, turn, nextSquares) == false) {
            continue;
          }
          const flipableCells = findFlipableCells(x, y, turn, nextSquares);
          ret.push({ x, y, flipableCells });
        }
      }
      ret.sort((i, j) => {
        if (i.flipableCells.length > j.flipableCells.length) {
          return -1;
        } else if (i.flipableCells.length < j.flipableCells.length) {
          return 1;
        }
        return 0;
      });
      return ret;
    },
    [validate, findFlipableCells]
  );

  /**
   * コマを置く場所を選択
   */
  const selectCell = useCallback(
    (
      x: number,
      y: number,
      currentTurn: number = turn,
      currentSquares: number[][] = squares
    ) => {
      const nextSquares = structuredClone(currentSquares);
      if (validate(x, y, currentTurn, nextSquares) == false) {
        return;
      }

      flip(x, y, currentTurn, nextSquares);
      const nextTurn = changeTurn(currentTurn, nextSquares);
      highlightPuttableCells(nextTurn, nextSquares);
      setTurn(nextTurn);
      setSquares(nextSquares);

      if (nextTurn === 0) {
        judgeWinner(nextSquares);
      } else if (nextTurn === 1) {
        setMsg("あなた（黒）の手番です。");
      } else if (nextTurn === 2) {
        setMsg("コンピュータ（白）の手番です。");
        const timeout = setTimeout(
          () => handleComputer(nextTurn, nextSquares),
          500
        );
        return () => clearTimeout(timeout);
      }
    },
    [
      changeTurn,
      flip,
      highlightPuttableCells,
      judgeWinner,
      squares,
      turn,
      validate,
    ]
  );

  const handleComputer = useCallback(
    (nextTurn: number, nextSquares: number[][]) => {
      const flipableCells = calculatePuttable(nextTurn, nextSquares);
      const nextPut = flipableCells[0];
      selectCell(nextPut.x, nextPut.y, nextTurn, nextSquares);
    },
    [calculatePuttable, selectCell]
  );

  return {
    msg,
    turn,
    squares,
    initialize,
    selectCell,
  };
};
