/*
write an ai that can play tic tac toe with the player
interface? already done
input?  btn press to initialize and call the ai, btn press to determine who's what symbol, btn press to trigger ai's turn
output? ai move printed to gameboard
prompt the player to decide if they are X or O
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
    if the player is one away from victory, the ai will prioritize blocking them,
    else, the ai will then pick any legal square which has the most remaning chances for victory,
        if there is a tie between options, make a list of options and pick at random
*/

//Write a pubsub pattern to mediate claimCell() and checkForWin(), trackTurn(), and printClaim()

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
        if (state === "" && victory.getVictor() === "") {
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
        console.log(id);
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
    const gameContainer = document.getElementById("gameContainer")
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
    const applyMoveEvent = () => {
        let cellElements = document.querySelectorAll(".cells")
        for (let i = 0; i < cellElements.length; i++) {
            cellElements[i].addEventListener("click", (e) => {
                if ((e.target.textContent == "") && (victory.getVictor() === "")) {
                    //gameProcess.getCurrentPlayer().submitMove(e.target)
                    //e.target.style.color = gameProcess.getCurrentPlayer().getPlayerColor()
                    //gameProcess.checkMove(e.target)
                    //gameProcess.trackTurn()
                }
            })
        }
    }
    const getBoard = () => board
    return { setup, fillBoard, renderCell, applyMoveEvent, getBoard }
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
    let victor = "";
    // const checkForWin = (arr) => {
    //     let checkArr = []
    //     for (let i = 0; i < arr.length; i++) {
    //         checkArr.push(gameBoard.getBoard()[arr[i]].getState())
    //     }
    //     let result = ""
    //     for (let i = 0; i<checkArr.length;i++) {
    //         result += checkArr[i];
    //     }
    //     if ((result === "OOO") || (result === "XXX")) {
    //         victor = gameProcess.getCurrentPlayer().getName();
    //         gameProcess.announceResults(victor);
    //     }
    // }
    const checkO = cell => cell.getState() === "O";
    const checkX = cell => cell.getState() === "X";
    const checkForWin = (arr) => {
        if (arr.every(checkO) || arr.every(checkX)) {
            victor = gameProcess.getCurrentPlayer();
        }
    }
    const getVictor = () => victor;
    return {
        checkO,
        topHorizontal,
        centerHorizontal,
        bottomHorizontal,
        leftVertical,
        middleVertical,
        rightVertical,
        upDiagonal,
        downDiagonal,
        checkForWin,
        getVictor
    }
})();

const gameProcess = (() => {
    const playerList = [];
    let currentPlayer
    let oColor = "#c96480"
    let xColor = "#99d17b"
    let turn = 0;
    const getColor = (playerNum) => {
        switch (playerNum) {
            case 0: {
                return oColor;
                break;
            }
            case 1: {
                return xColor;
                break;
            }
        }
    }
    const init = () => {
        playerList.push(players(prompt("input player 1 name"), "O", getColor(0)));
        playerList.push(players(prompt("input player 2 name"), "X", getColor(1)));
        gameProcess.trackTurn();
        gameBoard.renderCell();
        gameBoard.applyMoveEvent();
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
    const changeCurrentPlayer = (num) => currentPlayer = playerList[num]
    const checkMove = (claimedCell) => {
        console.log(claimedCell.getId())
        //getting id of event target ("cell#"), and slicing off the number to change the corresponding cell object's state in addition to pushing the symbol to the DOM
        let cellId = gameBoard.getBoard()[claimedCell.getId() - 1];
        switch (cellId.getId()) {
            case (2):
                victory.checkForWin(victory.topHorizontal)
                victory.checkForWin(victory.middleVertical)
                break;
            case (3):
                victory.checkForWin(victory.topHorizontal)
                victory.checkForWin(victory.rightVertical)
                victory.checkForWin(victory.upDiagonal)
                break;
            case (4):
                victory.checkForWin(victory.centerHorizontal)
                victory.checkForWin(victory.leftVertical)
                break;
            case (5):
                victory.checkForWin(victory.topHorizontal)
                victory.checkForWin(victory.centerHorizontal)
                victory.checkForWin(victory.bottomHorizontal)
                victory.checkForWin(victory.leftVertical)
                victory.checkForWin(victory.middleVertical)
                victory.checkForWin(victory.rightVertical)
                victory.checkForWin(victory.upDiagonal)
                victory.checkForWin(victory.downDiagonal)
                break;
            case (6):
                victory.checkForWin(victory.centerHorizontal)
                victory.checkForWin(victory.rightVertical)
                break;
            case (7):
                victory.checkForWin(victory.bottomHorizontal)
                victory.checkForWin(victory.leftVertical)
                victory.checkForWin(victory.upDiagonal)
                break;
            case (8):
                victory.checkForWin(victory.bottomHorizontal)
                victory.checkForWin(victory.middleVertical)
                break;
            case (9):
                victory.checkForWin(victory.bottomHorizontal)
                victory.checkForWin(victory.rightVertical)
                victory.checkForWin(victory.downDiagonal)
                break;
            case (1):
                victory.checkForWin(victory.topHorizontal)
                victory.checkForWin(victory.leftVertical)
                victory.checkForWin(victory.downDiagonal)
                break;
        }
    }
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