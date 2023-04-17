const board = document.getElementById('board');
const result = document.getElementById('result');
const restart = document.getElementById('restart');
const cells = Array.from({ length: 9 }).map(() => '');
const HUMAN = 'X';
const AI = 'O';

board.innerHTML = cells
    .map((_, index) => `<div class="cell" data-index="${index}"></div>`)
    .join('');

board.addEventListener('click', (event) => {
    const cell = event.target;

    // Make sure the clicked element is a cell
    if (!cell.classList.contains('cell')) return;

    const index = Number(cell.dataset.index);

    if (cells[index] !== '' || checkWinner(cells)) return;

    cells[index] = HUMAN;
    cell.textContent = HUMAN;

    const winner = checkWinner(cells);

    if (winner) {
        result.textContent = winner === HUMAN ? 'You won!' : 'AI won!';
    } else if (isBoardFull(cells)) {
        result.textContent = 'It\'s a draw!';
    } else {
        const aiMove = minimax(cells, AI).index;
        cells[aiMove] = AI;
        board.children[aiMove].textContent = AI;

        if (checkWinner(cells)) {
            result.textContent = 'AI won!';
        }
    }
});

restart.addEventListener('click', () => {
    // Clear the board, cells array, and result message
    cells.fill('');
    board.innerHTML = cells
        .map((_, index) => `<div class="cell" data-index="${index}"></div>`)
        .join('');
    result.textContent = '';
});

// Add the isBoardFull function
function isBoardFull(board) {
    return board.every(cell => cell !== '');
}

// Rest of the code (checkWinner and minimax functions)


function checkWinner(board) {
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const [a, b, c] of winConditions) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return null;
}

function minimax(newBoard, player) {
    const availableSpots = newBoard.reduce((acc, val, idx) => {
        if (val === '') acc.push(idx);
        return acc;
    }, []);

    const winner = checkWinner(newBoard);
    if (winner === HUMAN) return { score: -10 };
    if (winner === AI) return { score: 10 };
    if (availableSpots.length === 0) return { score: 0 };

    const moves = availableSpots.map((spot) => {
        const move = { index: spot };
        newBoard[spot] = player;

        if (player === AI) {
            move.score = minimax(newBoard, HUMAN).score;
        } else {
            move.score = minimax(newBoard, AI).score;
        }

        newBoard[spot] = '';

        return move;
    });

    let bestMove;
    if (player === AI) {
        let bestScore = -Infinity;
        moves.forEach((move) => {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach((move) => {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    }

    return bestMove;
}
