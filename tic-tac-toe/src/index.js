import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

/**
 * Renders a square with a specified prop:value.
 */
class Square extends React.Component {
    render() {
        return (
            <button className="square" onClick={() => this.props.onClick()}>
                {this.props.value}
            </button>
        );
    }
}

/**
 * Renders a board that has 9 squares in a 3X3 grid
 * Props: value - the value of the square to display ie., null, O, X
 *        onClick - the click handler for the square
 */
class Board extends React.Component {

    /**
     * Renders a square
     * @param {string} i The value to render in the square: null, 'X', 'O'
     */
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

/**
 * Tic Tac Toe game
 */
class Game extends React.Component {

    constructor() {
        super();
        this.state = {
            boards: [{
                squares: Array(9).fill(null),
                xIsNext: true,
                winner: null,
            }],
            currentBoard: 0
        };
    }

    /**
     * Returns the most recent board
     * @return {Board} Board at index this.state.currentBoard
     */
    getCurrentBoard() {
        return this.state.boards[this.state.currentBoard];
    }

    /**
     * Checks if the value at the specified positions.
     * If the values are equal then returns the value
     * Otherwise returns null
     * @param {string[]} squares An array of string representing values squares in a tic tac toe game
     * @param {number[]} positions An array of number representing the indexes to check
     * @returns {string} The string at the specified squares if they are all equal. Null otherwise 
     */
    checkPositions(squares, positions) {
        // TODO: validate inputs
        if (
            (squares[positions[0]] === squares[positions[1]]) && 
            (squares[positions[0]] === squares[positions[2]])
        ) {
            return squares[positions[0]];
        }
        return null;
    }
 
    /**
     * Check if there is a winner for tic tac toe game by checking rows, columns, diagonals
     * @param {string[]} squares An array of strings representing the values of squares in a tic tac toe game
     * @returns {string} Returns the winner of the tic tac toe board 
     */
    calculateWinner(squares) {
        const positions = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6],
        ];

        for (var i=0; i<positions.length; i++) {
            const winner = this.checkPositions(squares, positions[i]);
            if (winner) { 
                return winner; 
            }
        }
        return null;
    }

    /**
     * Click handler for a square in a Tic Tac Toe game
     * Ignores click is there is a winner already
     * Ignores click is the square already has a value
     * Places the player value at the specified square
     * Updates the next player
     * Determines if there is a winner
     * Creates a new Board with the updated squares, next player and winner
     * Adds it to the history of Boards
     * @param {*number} i The index of the square that was clicked 
     */
    handleClick(i) {
        const board = this.getCurrentBoard();

        /** Board already has winner. Ignore clicks */
        if (board.winner) {
            return;
        }

        const squares = board.squares.slice();
        if (i >= squares.length) {
            /** Invalid index! how did we get here? TODO: Error handling */
            return;
        }

        /** Square already has a value. Ignore clicks! */
        if (squares[i]) {
            return;
        }

        /** Place the player at the square */
        squares[i] = (board.xIsNext) ? 'X' : 'O';

        /** Check winner */
        const winner = this.calculateWinner(squares);
        const currentBoard = this.state.boards.length;
        
        /** Update state */
        this.setState({
            boards: this.state.boards.concat([{
                squares: squares,
                xIsNext: !board.xIsNext,
                winner: winner,
            }]),
            currentBoard: currentBoard
        });
    }

    /**
     * Reverts the game to a previous board state.
     * To do this: It creates a new board which is a copy of previous board  
     * and adds it to the collection of boards. 
     * @param {*number} iBoard index of board 
     */
    jumpToBoard(iBoard) {
        if (iBoard >= this.state.boards.length) {
            return;
        }

        const board = this.state.boards[iBoard];
        const currentBoard = this.state.boards.length;
        this.setState({
            boards: this.state.boards.concat([board]),
            currentBoard: currentBoard,
        });
    }

    /**
     * Renders a Tic Tac Toe board
     * Specifies a collections of square values and click handler
     */
    renderBoard() {
        const board = this.getCurrentBoard();
        console.log('Board @' + this.state.currentBoard + ' is ');
        console.log(board);
        return (
            <Board 
                squares={board.squares}
                onClick={(i) => this.handleClick(i)}
                />
        );
    }

    /**
     * Renders text that either indicates the next player or winner
     */
    renderStatus() {
        const board = this.getCurrentBoard();
        let status;
        if (board.winner != null) {
            status = "Winner " + board.winner;
        } else {
            status = "Next Player: " + (board.xIsNext ? "X" : "O"); 
        }
        return status;
    }
    
    /**
     * Renders links to all the previous board states
     * When the user click on a link the board is reverted to the specified state
     */
    renderHistory() {
        const boards = this.state.boards;
        const moves = boards.map((step, iBoard) => {
            const desc = (iBoard !== 0) ? ('Move #' + iBoard) : 'Game start'; 
            return (
                <li key={iBoard.toString()}>
                    <a href="#" onClick={() => this.jumpToBoard(iBoard)}>{desc}</a>
                </li>
            );
        });

        return moves;
    }

    render() {
        return (
        <div className="game">
            <div className="game-board">
                {this.renderBoard()}
            </div>
            <div className="game-info">
                <div>{this.renderStatus()}</div>
                <ol>{this.renderHistory()}</ol>
            </div>
        </div>);
    }
};


/**
 * Render Game
 */
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);