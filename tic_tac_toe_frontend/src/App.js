import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

const BOARD_SIZE = 9;

/**
 * Returns the winner symbol ("X" | "O") if there is one, otherwise null.
 * Also returns the winning line indices for UI highlighting.
 */
function calculateWinner(squares) {
  const lines = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

// PUBLIC_INTERFACE
function App() {
  /** This is the main entry UI for the Tic Tac Toe game. */
  const [squares, setSquares] = useState(() => Array(BOARD_SIZE).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  // Keep the template's theming mechanism; set to light as required.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  const { winner, line: winningLine } = useMemo(
    () => calculateWinner(squares),
    [squares]
  );

  const isBoardFull = useMemo(
    () => squares.every((v) => v !== null),
    [squares]
  );

  const gameState = useMemo(() => {
    if (winner) return "won";
    if (isBoardFull) return "draw";
    return "playing";
  }, [winner, isBoardFull]);

  const statusText = useMemo(() => {
    if (gameState === "won") return `Winner: ${winner}`;
    if (gameState === "draw") return "Draw — no more moves";
    return `Next player: ${xIsNext ? "X" : "O"}`;
  }, [gameState, winner, xIsNext]);

  const onSquareClick = useCallback(
    (index) => {
      // Ignore clicks when the game is over or the cell is already filled.
      if (gameState !== "playing") return;
      if (squares[index]) return;

      setSquares((prev) => {
        const next = prev.slice();
        next[index] = xIsNext ? "X" : "O";
        return next;
      });
      setXIsNext((prev) => !prev);
    },
    [gameState, squares, xIsNext]
  );

  // PUBLIC_INTERFACE
  const restartGame = useCallback(() => {
    /** Resets the board and sets turn back to X. */
    setSquares(Array(BOARD_SIZE).fill(null));
    setXIsNext(true);
  }, []);

  return (
    <div className="App">
      <main className="ttt-page" aria-label="Tic Tac Toe">
        <section className="ttt-card">
          <header className="ttt-header">
            <div>
              <h1 className="ttt-title">Tic Tac Toe</h1>
              <p className="ttt-subtitle">
                Take turns and get three in a row to win.
              </p>
            </div>

            <div className="ttt-badges" aria-label="Players">
              <span
                className={`ttt-badge ${xIsNext ? "active" : ""}`}
                aria-label="Player X"
              >
                X
              </span>
              <span
                className={`ttt-badge ${!xIsNext ? "active" : ""}`}
                aria-label="Player O"
              >
                O
              </span>
            </div>
          </header>

          <div
            className={`ttt-status ${
              gameState === "won"
                ? "status-won"
                : gameState === "draw"
                ? "status-draw"
                : "status-playing"
            }`}
            role="status"
            aria-live="polite"
          >
            {statusText}
          </div>

          <div className="ttt-board-wrap">
            <div className="ttt-board" role="grid" aria-label="3 by 3 board">
              {squares.map((value, idx) => {
                const isWinningCell =
                  winningLine ? winningLine.includes(idx) : false;
                const isDisabled = gameState !== "playing" || value !== null;

                return (
                  <button
                    key={idx}
                    type="button"
                    className={`ttt-cell ${isWinningCell ? "winning" : ""} ${
                      value === "X" ? "cell-x" : value === "O" ? "cell-o" : ""
                    }`}
                    onClick={() => onSquareClick(idx)}
                    disabled={isDisabled}
                    role="gridcell"
                    aria-label={`Cell ${idx + 1}${value ? `: ${value}` : ""}`}
                  >
                    <span className="ttt-cell-value" aria-hidden="true">
                      {value}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <footer className="ttt-footer">
            <button
              type="button"
              className="ttt-restart"
              onClick={restartGame}
            >
              Restart game
            </button>
            <p className="ttt-hint">
              Tip: You can’t place on an occupied square.
            </p>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
