import React from "react";

function Square(props) {
  const win = props.win;
  const className = "square" + (win ? " winner" : "");
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        win={this.props.line && this.props.line.includes(i)}
      />
    );
  }

  render() {
    const size = 3;
    let squares = [];
    for (let i = 0; i < size; ++i) {
      let row = [];
      for (let j = 0; j < size; ++j) {
        row.push(this.renderSquare(i * size + j));
      }
      squares.push(
        <div key={i} className="board-row">
          {row}
        </div>
      );
    }

    return <div>{squares}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          index: 0,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      ascending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (
      (calculateWinner(squares) && calculateWinner(squares).square) ||
      squares[i]
    ) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          index: i,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  handleSortToggle() {
    this.setState({
      ascending: !this.state.ascending,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const win = calculateWinner(current.squares);
    const winner = win && win.square;
    const moves = history.map((step, move) => {
      const index = step.index;
      const desc = move
        ? `Go to move # ${move} (${1 + Math.floor(index / 3)}, ${
            1 + (index % 3)
          })`
        : "Go to game start";

      const selected = move === this.state.stepNumber ? "selected" : "";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} className={selected}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (win.draw) {
      status = "Draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    const nextOrder = this.state.ascending ? "descending" : "ascending";

    !this.state.ascending && moves.reverse();

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            line={win && win.winner}
          />
        </div>
        <div className="game-info">
          <button
            onClick={() => {
              this.handleSortToggle();
            }}
          >
            Toggle Order to {nextOrder}
          </button>

          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { square: squares[a], winner: lines[i], draw: false };
    }
  }

  let draw = true;

  for (let i = 0; i < 9; i++) {
    if (squares[i] === null) {
      draw = false;
    }
  }

  return { square: null, winner: null, draw };
}

export default Game;
