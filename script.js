document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const modeSelection = document.querySelector('.mode-selection');
    const gameWrapper = document.getElementById('gameWrapper');
    const vsComputerBtn = document.getElementById('vsComputerBtn');
    const vsFriendBtn = document.getElementById('vsFriendBtn');
    const gameBoard = document.getElementById('gameBoard');
    const cells = document.querySelectorAll('.board-cell');
    const resetMatchBtn = document.getElementById('resetMatchBtn');
    const newGameBtn = document.getElementById('newGameBtn');
    const celebrationOverlay = document.getElementById('celebrationOverlay');
    const celebrationText = document.getElementById('celebrationText');
    const currentMatchEl = document.getElementById('currentMatch');
    const totalMatchesEl = document.getElementById('totalMatches');
    const matchCountSelect = document.getElementById('matchCount');
    const matchScoreBody = document.getElementById('matchScoreBody');
    const currentTurnDisplay = document.getElementById('currentTurnDisplay');
    const totalMatchesDisplay = document.getElementById('totalMatchesDisplay');
    const xTotalWins = document.getElementById('xTotalWins');
    const oTotalWins = document.getElementById('oTotalWins');

    // Game State Variables
    let currentPlayer = 'x';
    let gameActive = true;
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameMode = null;
    let matchCount = 3;
    let currentMatch = 1;
    let scores = { x: 0, o: 0 };
    let matchHistory = [];

    // Winning Combinations
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    // Event Listeners for Game Mode Selection
    vsComputerBtn.addEventListener('click', () => startGame('computer'));
    vsFriendBtn.addEventListener('click', () => startGame('friend'));
    matchCountSelect.addEventListener('change', (e) => {
        matchCount = parseInt(e.target.value);
        totalMatchesEl.textContent = matchCount;
        totalMatchesDisplay.textContent = matchCount;
    });

    // Start Game Function
    function startGame(mode) {
        gameMode = mode;
        modeSelection.style.display = 'none';
        gameWrapper.style.display = 'block';
        totalMatchesEl.textContent = matchCount;
        totalMatchesDisplay.textContent = matchCount;
        resetMatchHistory();
    }

    // Reset Match History
    function resetMatchHistory() {
        matchHistory = [];
        matchScoreBody.innerHTML = '';
        xTotalWins.textContent = '0';
        oTotalWins.textContent = '0';
    }

    // Cell Click Handler
    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => cellClicked(cell, index));
    });

    function cellClicked(cell, index) {
        if (gameState[index] !== '' || !gameActive) return;

        gameState[index] = currentPlayer;
        cell.textContent = currentPlayer.toUpperCase();
        cell.classList.add(currentPlayer);
        currentTurnDisplay.textContent = currentPlayer === 'x' ? 'O' : 'X';

        if (checkWinner()) {
            handleGameEnd(currentPlayer);
        } else if (checkDraw()) {
            handleGameEnd('draw');
        } else {
            currentPlayer = currentPlayer === 'x' ? 'o' : 'x';

            // Computer Move
            if (gameMode === 'computer' && currentPlayer === 'o') {
                setTimeout(computerMove, 500);
            }
        }
    }

    // Computer Move Logic
    function computerMove() {
        const emptyIndexes = gameState.reduce((acc, val, idx) => 
            val === '' ? [...acc, idx] : acc, []);
        
        if (emptyIndexes.length > 0) {
            const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
            cellClicked(cells[randomIndex], randomIndex);
        }
    }

    // Check Winner Function
    function checkWinner() {
        return winningConditions.some(condition => {
            return condition.every(index => {
                return gameState[index] === currentPlayer;
            });
        });
    }

    // Check Draw Function
    function checkDraw() {
        return gameState.every(cell => cell !== '');
    }

    // Handle Game End
    function handleGameEnd(result) {
        gameActive = false;

        if (result !== 'draw') {
            scores[result]++;
            celebrationText.textContent = `Player ${result.toUpperCase()} Wins!`;
        } else {
            celebrationText.textContent = "It's a Draw!";
        }

        updateMatchHistory(result);
        celebrationOverlay.style.display = 'flex';

        if (currentMatch < matchCount) {
            setTimeout(() => {
                celebrationOverlay.style.display = 'none';
                resetMatch();
                currentMatch++;
                currentMatchEl.textContent = currentMatch;
            }, 2000);
        } else {
            announceSeriesWinner();
        }
    }

    // Update Match History
    function updateMatchHistory(result) {
        matchHistory.push(result);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Match ${currentMatch}</td>
            <td>${result === 'draw' ? 'Draw' : `Player ${result.toUpperCase()}`}</td>
        `;
        matchScoreBody.appendChild(row);
        xTotalWins.textContent = scores.x;
        oTotalWins.textContent = scores.o;
    }

    // Announce Series Winner
    function announceSeriesWinner() {
        setTimeout(() => {
            const xWins = scores.x;
            const oWins = scores.o;
            let message = '';

            if (xWins > oWins) {
                message = 'Player X Wins the Series!';
            } else if (oWins > xWins) {
                message = 'Player O Wins the Series!';
            } else {
                message = 'Series Ended in a Draw!';
            }

            celebrationText.textContent = message;
        }, 2000);
    }

    // Reset Match
    function resetMatch() {
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'x';
        currentTurnDisplay.textContent = 'X';
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
    }

    // Reset Game Event Listeners
    resetMatchBtn.addEventListener('click', resetMatch);
    newGameBtn.addEventListener('click', () => {
        gameWrapper.style.display = 'none';
        modeSelection.style.display = 'flex';
        celebrationOverlay.style.display = 'none';
        currentMatch = 1;
        currentMatchEl.textContent = '1';
        scores = { x: 0, o: 0 };
        resetMatch();
        resetMatchHistory();
    });
});
