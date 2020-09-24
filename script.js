/*
write an ai that can play tic tac toe with the player
interface? already done
input?  btn press to initialize and call the ai, btn press to determine who's what symbol, btn press to trigger ai's turn
output? ai move printed to gameboard
prompt the player to decide if they are X or O
const playerSelection = () =>  return prompt("Do You Want To Be X's Or O's? O's Go First")
prompt the player for difficulty level; normal or hard
normal
whenever it is the ai's turn, generate a random number between 1-10
    if the number is even
        pick a random remaining square
    else
        use the hard ai
hard
If ai is O, they go first and take the center square
    else they pick a random remaining square
whenever the player moves, 
    if the com is one move away from victory,
        find which winconditions have been claimed by 
        make that move
    else, if the player is one away from victory,
        prioritize blocking them,
    else, the ai will then pick any legal square which has the most remaning chances for victory,
        start by looking for any lines with one comClaimed space, and two empty,
            check the two empty ones,
                else if one has none claimed, claim that one
                else claim the remaining
                    if there is a tie between options, make a list of options and pick at random
*/

//Write a pubsub pattern to mediate claimCell() and checkForWin(), trackTurn(), and printClaim()

const promptSymbol = () => prompt("Do You Want To Be X's Or O's? O's Go First!");
const promptDifficulty = () => prompt("What Difficulty? Normal Or Hard?")
const playerSelection = () => {
    const playerSymbol = promptSymbol().toLocaleUpperCase();
    const comDifficulty = promptDifficulty().toLocaleUpperCase();
    if (playerSymbol === "X" || playerSymbol === "O") {
        const isX = playerSymbol === "X";
        isX ? startXGame() : startOGame();
    }
    if (comDifficulty === "NORMAL" || comDifficulty === "HARD") {
        setDifficulty(comDifficulty);
    };
};
const setDifficulty = difficulty => console.log(difficulty);
const startXGame = () => console.log("X Game Started");
const startOGame = () => console.log("O Game Started");

const generateMove = (symbol) => {
    let playerSymbol;
    symbol === "X" ? playerSymbol = "O" : playerSymbol = "X";
    let myConditions = findAvailableConditions(symbol);
    let theirConditions = findAvailableConditions(playerSymbol)
    if (!!win(myConditions,symbol)) {
        return win(myConditions,symbol);
    } else if (!!preventLoss(theirConditions,playerSymbol)) {
        return preventLoss(theirConditions,playerSymbol);
    }
}

const genRandomMove = () => {
    let num = Math.floor(Math.random() * 9)
    console.log(num)
    if (gameBoard.getBoard()[num].getState() === "") {
        return gameBoard.getBoard()[num];
    } else {
        return genRandomMove();
    }
}

const win = (condition,symbol) => {
    for (let i=0;i<condition.length;i++) {
        if (!!findWinningMove(condition[i], symbol)) {
            return findWinningMove(condition[i], symbol);
        }
    }
}

const preventLoss = (condition,symbol) => {
    for (let i=0;i<condition.length;i++) {
        if (!!findWinningMove(condition[i], symbol)) {
            return findWinningMove(condition[i], symbol);
        }
    }
}

const checkForSymbol = (symbol) => {
    const claimedConditions = [];
    for (let i = 0; i < victory.winConditions.length; i++) {
        if (victory.winConditions[i].some(condition => condition.getState() === symbol)) {
            claimedConditions.push(victory.winConditions[i]);
        }
    }
    return claimedConditions;
}

const findWinningMove = (arr,symbol) => {
    for (let i=0;i<arr.length;i++) {
        let checkedArr = arr.filter(cell => cell.getState() === symbol);
        if (checkedArr.length >= 2){
            return arr.filter(cell => !checkedArr.includes(cell))[0];
        }
    }
}

const findAvailableConditions = (symbol) => {
    let playerSymbol
    symbol === "X" ? playerSymbol = "O" : playerSymbol = "X";
    let unavailableConditions = checkForSymbol(playerSymbol);
    let availableConditions = checkForSymbol(symbol);
    return availableConditions.filter((condition) => !unavailableConditions.includes(condition));
}


const publisher = (() => {
    const subscriptions = [];
    const getSubs = () => subscriptions;
    const subscribe = (event, fn) => {
        if (!subscriptions[event]) {
            subscriptions.push(event);
            subscriptions[event] = [];
        }
        subscriptions[event].push(fn);
    }
    const emit = (event, value) => {
        if (subscriptions[event])
            for (let i = 0; i < subscriptions[event].length; i++) {
                subscriptions[event][i](value);
            }
    }
    return { getSubs, subscribe, emit }
})();

const players = function (name, symbol, color) {
    const getName = () => name;
    const getSymbol = () => symbol;
    const getPlayerColor = () => color
    const submitMove = function (location) {
        return location.textContent = getSymbol();
    }
    return { getName, getSymbol, getPlayerColor, submitMove }
}

const cells = (id, xCoord, yCoord) => {
    let state = "";
    let color;
    const getId = () => id;
    const getState = () => state;
    const getColor = () => color;
    const changeState = symbol => state = symbol;
    const changeColor = newColor => color = newColor
    const makeCellElement = function () {
        const div = document.createElement("div");
        div.classList.add("cells", xCoord, yCoord);
        div.addEventListener("click", () => claimCell(this));
        return div;
    }
    const claimCell = function (cell) {
        if (state === "" && !victory.getVictor()) {
            changeState(gameProcess.getCurrentPlayer().getSymbol());
            changeColor(gameProcess.getCurrentPlayer().getPlayerColor());
            printCell(cell)
            publisher.emit("cellClaimed", cell)
        }
    }
    const printCell = function (cell) {
        let cellNodes = document.querySelectorAll(".cells");
        cellNodes[id - 1].style.color = color;
        cellNodes[id - 1].textContent = state;
    }
    return { getId, getState, getColor, changeState, makeCellElement, claimCell, printCell };
}

const makeCells = (() => {
    const cellArr = [];
    const determineX = cellId => {
        switch (cellId % 3) {
            case 1:
                return "left";
            case 2:
                return "middle";
            case 0:
                return "right";
        };
    };
    const determineY = cellId => {
        switch (true) {
            case (cellId <= 3):
                return "top";
            case (cellId <= 5 && cellId > 3):
                return "center";
            case (cellId <= 9 && cellId > 6):
                return "bottom";
        };
    };
    for (let i = 1; i < 10; i++) {
        cellArr.push(cells(i, determineX(i), determineY(i)));
    };
    return { cellArr }
})();

const gameBoard = (() => {
    const board = [];
    const getBoard = () => board;
    const gameContainer = document.getElementById("gameContainer");
    const applySetupEvent = (() => {
        const btn = document.querySelectorAll("BUTTON")
        btn.forEach(element => element.addEventListener("click", e => gameBoard.setup(e.target.textContent)))
    })()
    const setup = (playerCount) => {
        if (playerCount === "1 Player") {
            console.log("Can't do that yet")
        } else {
            gameProcess.init();
        }
    }
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
    return { setup, fillBoard, renderCell, getBoard }
})();

const victory = (() => {
    //create arrs of win conditions
    const board = gameBoard.getBoard()
    const topHorizontal = [board[0], board[1], board[2]];
    const centerHorizontal = [board[3], board[4], board[5]];
    const bottomHorizontal = [board[6], board[7], board[8]];
    const leftVertical = [board[0], board[3], board[6]];
    const middleVertical = [board[1], board[4], board[7]];
    const rightVertical = [board[2], board[5], board[8]];
    const downDiagonal = [board[0], board[4], board[8]];
    const upDiagonal = [board[6], board[4], board[2]];
    const winConditions = [topHorizontal, centerHorizontal, bottomHorizontal, leftVertical, middleVertical, rightVertical, downDiagonal, upDiagonal];

    let victor = false;
    const getVictor = () => victor;

    const checkO = cell => cell.getState() === "O";
    const checkX = cell => cell.getState() === "X";
    const checkForWin = (arr) => {
        if (arr.every(checkO) || arr.every(checkX)) {
            return victor = gameProcess.getCurrentPlayer();
        }
    }
    return { checkO, winConditions, checkForWin, getVictor }
})();

const gameProcess = (() => {
    const playerList = [];
    let currentPlayer;
    let oColor = "#c96480";
    let xColor = "#99d17b";
    let turn = 0;
    const getColor = (playerNum) => {
        switch (playerNum) {
            case 0: {
                return oColor;
            }
            case 1: {
                return xColor;
            }
        }
    }
    const init = () => {
        playerList.push(players(prompt("input player 1 name"), "O", getColor(0)));
        playerList.push(players(prompt("input player 2 name"), "X", getColor(1)));
        gameProcess.trackTurn();
        gameBoard.renderCell();
    }
    const trackTurn = () => {
        if (!victory.getVictor()) {
            turn++
            if ((turn % 2) > 0) {
                changeCurrentPlayer(0)
            } else {
                changeCurrentPlayer(1)
            }
        }
    }
    const getCurrentPlayer = () => currentPlayer
    const changeCurrentPlayer = (num) => currentPlayer = playerList[num];
    const checkMove = () => {
        for (let i = 0; i < victory.winConditions.length; i++) {
            console.log(victory.checkForWin(victory.winConditions[i]))
            if (victory.checkForWin(victory.winConditions[i])) {
                console.log(true);
            };
        };
    };
    publisher.subscribe("cellClaimed", checkMove);
    publisher.subscribe("cellClaimed", trackTurn);
    const announceResults = (player) => {
        const makeDiv = document.createElement("DIV")
        const makeBanner = document.createElement("H1")
        document.body.appendChild(makeDiv)
        const bannerContainer = document.body.lastElementChild
        bannerContainer.id = "bannerContainer"
        bannerContainer.appendChild(makeBanner)
        document.body.lastElementChild.lastElementChild.id = "banner"
        const banner = document.getElementById("banner")
        banner.textContent = player + " wins!"
    }
    return { getColor, init, trackTurn, getCurrentPlayer, changeCurrentPlayer, checkMove, announceResults }
})();