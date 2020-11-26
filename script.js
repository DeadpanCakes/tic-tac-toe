const ai = (() => {
  let difficultyMode;
  const setDifficulty = (difficulty) => (difficultyMode = difficulty);

  const genRandomMove = () => {
    let num = Math.floor(Math.random() * 9);
    if (gameBoard.getBoard()[num].getState() === "") {
      return gameBoard.getBoard()[num].getId();
    } else {
      return genRandomMove();
    }
  };

  const claimMiddle = () => gameBoard.getBoard()[4].getId();

  const generateMove = () => {
    let symbol = gameProcess.getCurrentPlayer().getSymbol();
    let opponentSymbol;
    symbol === "X" ? (opponentSymbol = "O") : (opponentSymbol = "X");
    let myConditions = findAvailableConditions(symbol);
    let theirConditions = findAvailableConditions(opponentSymbol);
    if (gameBoard.getBoard()[4].getState() === "") {
      return claimMiddle();
    } else if (!checkForSymbol(symbol)[0]) {
      const corners = [1, 3, 7, 9];
      return corners[Math.floor(Math.random() * (corners.length - 1))];
    } else if (!!win(myConditions, symbol)) {
      return win(myConditions, symbol).getId();
    } else if (!!preventLoss(theirConditions, opponentSymbol)) {
      return preventLoss(theirConditions, opponentSymbol).getId();
    } else if (findOptimalMove(symbol)[0]) {
      const moves = findOptimalMove(symbol);
      const move = moves[Math.floor(Math.random() * (moves.length - 1))];
      return move;
    } else {
      return genRandomMove();
    }
  };

  const submitMove = () => {
    if (difficultyMode === "EASY") {
      const id = genRandomMove();
      makeCells.cellArr[id - 1].claimCell();
    } else if (difficultyMode === "NORMAL") {
      const diceRoll = Math.random() * 10 + 1;
      if (diceRoll < 6) {
        const id = genRandomMove();
        makeCells.cellArr[id - 1].claimCell();
      } else {
        const id = generateMove();
        makeCells.cellArr[id - 1].claimCell();
      }
    } else if (difficultyMode === "HARD") {
      const id = generateMove();
      makeCells.cellArr[id - 1].claimCell();
    }
  };

  const checkForSymbol = (symbol) => {
    const claimedConditions = [];
    for (let i = 0; i < victory.winConditions.length; i++) {
      if (
        victory.winConditions[i].some(
          (condition) => condition.getState() === symbol
        )
      ) {
        claimedConditions.push(victory.winConditions[i]);
      }
    }
    return claimedConditions;
  };

  const findAvailableConditions = (symbol) => {
    let playerSymbol;
    symbol === "X" ? (playerSymbol = "O") : (playerSymbol = "X");
    let unavailableConditions = checkForSymbol(playerSymbol);
    let availableConditions = checkForSymbol(symbol);
    return availableConditions.filter(
      (condition) => !unavailableConditions.includes(condition)
    );
  };

  const findWinningMove = (arr, symbol) => {
    for (let i = 0; i < arr.length; i++) {
      let checkedArr = arr.filter((cell) => cell.getState() === symbol);
      if (checkedArr.length >= 2) {
        return arr.filter((cell) => !checkedArr.includes(cell))[0];
      }
    }
  };

  const win = (condition, symbol) => {
    for (let i = 0; i < condition.length; i++) {
      if (!!findWinningMove(condition[i], symbol)) {
        return findWinningMove(condition[i], symbol);
      }
    }
  };

  const preventLoss = (condition, symbol) => {
    for (let i = 0; i < condition.length; i++) {
      if (!!findWinningMove(condition[i], symbol)) {
        return findWinningMove(condition[i], symbol);
      }
    }
  };

  const collateMoves = (symbol) => {
    const availableConditions = findAvailableConditions(symbol);
    let moves = [];
    for (let i = 0; i < availableConditions.length; i++) {
      moves = moves.concat(availableConditions[i]);
    }
    return moves;
  };

  const findOptimalMove = (symbol) => {
    const winConditions = collateMoves(symbol);
    let legalCells = winConditions.filter(
      (element) => element.getState() === ""
    );
    let legalMoves = legalCells
      .map((element) => {
        return element.getId();
      })
      .sort((a, b) => a - b);
    const optimalMoves = legalMoves.filter(
      (element) =>
        legalMoves.indexOf(element) !== legalMoves.lastIndexOf(element)
    );
    if (!!optimalMoves[0]) {
      return optimalMoves;
    } else {
      return legalMoves;
    }
  };
  return { setDifficulty, genRandomMove, submitMove };
})();

const publisher = (() => {
  const subscriptions = [];
  const getSubs = () => subscriptions;
  const subscribe = (event, fn) => {
    if (!subscriptions[event]) {
      subscriptions.push(event);
      subscriptions[event] = [];
    }
    subscriptions[event].push(fn);
  };
  const emit = (event, value) => {
    if (subscriptions[event])
      for (let i = 0; i < subscriptions[event].length; i++) {
        subscriptions[event][i](value);
        console.log("event fired");
      }
  };
  return { getSubs, subscribe, emit };
})();

const players = function (name, symbol, color) {
  const getName = () => name;
  const getSymbol = () => symbol;
  const getPlayerColor = () => color;
  return { getName, getSymbol, getPlayerColor };
};

const cells = (id, xCoord, yCoord) => {
  let state = "";
  let color;
  const getId = () => id;
  const getState = () => state;
  const getColor = () => color;
  const changeState = (symbol) => (state = symbol);
  const changeColor = (newColor) => (color = newColor);
  const makeCellElement = function () {
    const div = document.createElement("div");
    div.classList.add("cells", xCoord, yCoord);
    div.addEventListener("click", () => claimCell(this));
    return div;
  };
  const claimCell = function (cell) {
    if (state === "" && !victory.getVictor()) {
      changeState(gameProcess.getCurrentPlayer().getSymbol());
      changeColor(gameProcess.getCurrentPlayer().getPlayerColor());
      printCell(cell);
      publisher.emit("cellClaimed", cell);
    }
  };
  const printCell = function (cell) {
    let cellNodes = document.querySelectorAll(".cells");
    cellNodes[id - 1].style.color = color;
    cellNodes[id - 1].textContent = state;
  };
  return {
    getId,
    getState,
    getColor,
    changeState,
    makeCellElement,
    claimCell,
    printCell,
  };
};

const makeCells = (() => {
  const cellArr = [];
  const determineX = (cellId) => {
    switch (cellId % 3) {
      case 1:
        return "left";
      case 2:
        return "middle";
      case 0:
        return "right";
    }
  };
  const determineY = (cellId) => {
    switch (true) {
      case cellId <= 3:
        return "top";
      case cellId <= 5 && cellId > 3:
        return "center";
      case cellId <= 9 && cellId > 6:
        return "bottom";
    }
  };
  for (let i = 1; i < 10; i++) {
    cellArr.push(cells(i, determineX(i), determineY(i)));
  }
  return { cellArr };
})();

const gameBoard = (() => {
  const board = [];
  const getBoard = () => board;
  const gameContainer = document.getElementById("gameContainer");
  const applySetupEvent = (() => {
    const btn = document.querySelectorAll("BUTTON");
    btn.forEach((element) =>
      element.addEventListener("click", (e) =>
        gameBoard.setup(e.target.textContent)
      )
    );
  })();
  const setup = (playerCount) => {
    if (playerCount === "1 Player") {
      gameProcess.init(1);
    } else {
      gameProcess.init(2);
    }
  };
  const fillBoard = (() => {
    for (let i = 0; i < 9; i++) {
      board.push(makeCells.cellArr[i]);
    }
  })();
  const renderCell = () => {
    for (let i = 0; i < board.length; i++) {
      gameContainer.appendChild(makeCells.cellArr[i].makeCellElement());
    }
  };
  return { setup, fillBoard, renderCell, getBoard };
})();

const victory = (() => {
  const board = gameBoard.getBoard();
  const topHorizontal = [board[0], board[1], board[2]];
  const centerHorizontal = [board[3], board[4], board[5]];
  const bottomHorizontal = [board[6], board[7], board[8]];
  const leftVertical = [board[0], board[3], board[6]];
  const middleVertical = [board[1], board[4], board[7]];
  const rightVertical = [board[2], board[5], board[8]];
  const downDiagonal = [board[0], board[4], board[8]];
  const upDiagonal = [board[6], board[4], board[2]];
  const winConditions = [
    topHorizontal,
    centerHorizontal,
    bottomHorizontal,
    leftVertical,
    middleVertical,
    rightVertical,
    downDiagonal,
    upDiagonal,
  ];

  let victor = false;
  const getVictor = () => victor;

  const assignVictor = (player) => {
    victor = player;
    publisher.emit("gameOver", "victory");
  };

  const checkO = (cell) => cell.getState() === "O";
  const checkX = (cell) => cell.getState() === "X";
  const checkForWin = (arr) => {
    if (arr.every(checkO) || arr.every(checkX)) {
      return (victor = gameProcess.getCurrentPlayer());
    }
  };
  return { checkO, winConditions, assignVictor, checkForWin, getVictor };
})();

const gameProcess = (() => {
  const playerList = [];
  let currentPlayer;
  let oColor = "#c96480";
  let xColor = "#99d17b";
  let turn = 0;

  const startXGame = () => {
    playerList.push(players("COM", "O", getColor(0)));
    playerList.push(players(prompt("Input Player Name"), "X", getColor(1)));
    gameProcess.trackTurn();
    gameBoard.renderCell();
    ai.submitMove();
  };
  const startOGame = () => {
    playerList.push(players(prompt("Input Player Name"), "O", getColor(0)));
    playerList.push(players("COM", "X", getColor(1)));
    gameProcess.trackTurn();
    gameBoard.renderCell();
  };

  const promptSymbol = () =>
    prompt("Do You Want To Be X's Or O's? O's Go First!");
  const promptDifficulty = () =>
    prompt("What Difficulty? Easy, Normal, Or Hard?");
  const playerSelection = () => {
    const playerSymbol = promptSymbol().toLocaleUpperCase();
    const comDifficulty = promptDifficulty().toLocaleUpperCase();
    ai.setDifficulty(comDifficulty);
    if (playerSymbol === "X" || playerSymbol === "O") {
      const isX = playerSymbol === "X";
      isX ? startXGame() : startOGame();
    }
  };

  const getColor = (playerNum) => {
    switch (playerNum) {
      case 0: {
        return oColor;
      }
      case 1: {
        return xColor;
      }
    }
  };
  const init = (playerCount) => {
    if (playerCount === 1) {
      playerSelection();
      const cells = document.querySelectorAll(".cells");
      for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", () => {
          if (turn <= 9) {
            publisher.emit("comTurn");
          }
        });
      }
    } else {
      playerList.push(players(prompt("input player 1 name"), "O", getColor(0)));
      playerList.push(players(prompt("input player 2 name"), "X", getColor(1)));
      gameProcess.trackTurn();
      gameBoard.renderCell();
    }
  };
  const trackTurn = () => {
    turn++;
    if (turn % 2 > 0) {
      changeCurrentPlayer(0);
    } else {
      changeCurrentPlayer(1);
    }
    if (turn > 9 && !victory.getVictor()) {
      publisher.emit("gameOver", "draw");
    }
  };

  const getCurrentPlayer = () => currentPlayer;
  const changeCurrentPlayer = (num) => (currentPlayer = playerList[num]);
  const checkMove = () => {
    for (let i = 0; i < victory.winConditions.length; i++) {
      if (victory.checkForWin(victory.winConditions[i])) {
        victory.assignVictor(getCurrentPlayer().getName());
      }
    }
  };
  const announceResults = (result) => {
    const makeBanner = () => document.createElement("h1");
    const header = document.getElementById("title");
    if (result === "victory") {
      const banner = makeBanner();
      banner.textContent = `${victory.getVictor()} Is The Winner!`;
      header.appendChild(banner);
    } else if (result === "draw") {
      const banner = makeBanner();
      banner.textContent = "It's A Draw!!!";
      header.appendChild(banner);
    }
  };
  publisher.subscribe("comTurn", ai.submitMove);
  publisher.subscribe("cellClaimed", checkMove);
  publisher.subscribe("cellClaimed", trackTurn);
  publisher.subscribe("gameOver", announceResults);
  return {
    getColor,
    init,
    trackTurn,
    getCurrentPlayer,
    checkMove,
    announceResults,
  };
})();
