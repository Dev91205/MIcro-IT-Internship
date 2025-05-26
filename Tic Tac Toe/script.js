const board = document.getElementById("board");
const status = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const winLine = document.getElementById("win-line");
const modeSelect = document.getElementById("mode");

let currentPlayer = "X";
let gameActive = true;
let cells = Array(9).fill("");
let isAI = false;

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6]             // diagonals
];

function renderBoard() {
  board.innerHTML = "";
  cells.forEach((cell, index) => {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    cellDiv.textContent = cell;
    cellDiv.addEventListener("click", () => handleCellClick(index));
    board.appendChild(cellDiv);
  });
}

function handleCellClick(index) {
  if (cells[index] !== "" || !gameActive) return;

  cells[index] = currentPlayer;
  renderBoard();

  const winner = checkWin();
  if (winner) {
    status.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    drawWinLine(winner);
    return;
  }

  if (cells.every(cell => cell !== "")) {
    status.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  status.textContent = `Player ${currentPlayer}'s turn`;

  if (isAI && currentPlayer === "O") {
    setTimeout(() => {
      aiMove();
    }, 500);
  }
}

function checkWin() {
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return combo;
    }
  }
  return null;
}

function drawWinLine([a, , c]) {
  const cellSize = 100 + 10; // 100px cell + 10px gap
  const offset = cellSize / 2;

  const positions = [
    { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
    { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
    { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }
  ];

  const start = positions[a];
  const end = positions[c];

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  const length = Math.sqrt(dx * dx + dy * dy) * cellSize;

  winLine.style.left = `${start.x * cellSize + offset}px`;
  winLine.style.top = `${start.y * cellSize + offset}px`;
  winLine.style.width = `${length}px`;
  winLine.style.transform = `rotate(${angle}deg)`;
  winLine.style.display = "block";
}

function aiMove() {
  if (!gameActive) return;

  // Simple AI: pick first empty cell
  for (let i = 0; i < cells.length; i++) {
    if (cells[i] === "") {
      handleCellClick(i);
      break;
    }
  }
}

function restartGame() {
  cells = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  status.textContent = `Player ${currentPlayer}'s turn`;
  winLine.style.display = "none";
  renderBoard();
}

modeSelect.addEventListener("change", () => {
  isAI = modeSelect.value === "ai";
  restartGame();
});

restartBtn.addEventListener("click", restartGame);

renderBoard();
