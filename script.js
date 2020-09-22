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

const players = function (name, symbol, color) {
    const getName = () => name;
    const getSymbol = () => symbol;
    const getPlayerColor = () => color
    const submitMove = function (location) {
        return location.textContent = getSymbol();
    }
    return { getName, getSymbol, getPlayerColor, submitMove }
}

/*
refactor cells object to encapsulate more of the cell information such as x and y coordinates, makeCellElement() as a method etc
*/

const cells = (id,xCoord,yCoord) => {
    let state;
    const getId = () => id;
    const getState = () => state;
    const changeState = symbol => state = symbol;
    makeCellElement = function() {
        const div = document.createElement("div");
        div.classList.add("cells",xCoord,yCoord);
        //figure out how to bind this to div element
        that = this
        div.addEventListener("click", claimCell.bind(that));
        return div;
    }
    const claimCell = cell => {
         if (state === undefined && victory.getVictor() === "" ) {
            console.log(this);
            state = gameProcess.getCurrentPlayer().getSymbol();
            cell.textContent = state;
         }
    }
    return { getId, getState, changeState, makeCellElement, claimCell };
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
            case (cellId <= 2):
                return "top";
            case (cellId <= 5 && cellId > 2):
                return "center";
            case (cellId <= 8 && cellId > 5):
                return "bottom";
        };
    };
    for (let i=1;i<10;i++) {
        cellArr.push(cells(i,determineX(i),determineY(i)));
    };
    return {cellArr}
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
    const cellElement = document.createElement("DIV");
    const gameContainer = document.getElementById("gameContainer")
    const fillBoard = () => {
        for (let i = 0; i < 9; i++) {
            board.push(cells(i));
        }
    }
    const renderCell = () => {
        for (let i = 0; i < board.length; i++) {
            gameContainer.appendChild(cellElement.cloneNode());
            gameContainer.lastElementChild.className = "cells"
            gameContainer.lastElementChild.id = "cell" + i
            switch (i % 3) {
                case 0:
                    gameContainer.lastElementChild.classList.add("left");
                    break;
                case 1:
                    gameContainer.lastElementChild.classList.add("middle");
                    break;
                case 2:
                    gameContainer.lastElementChild.classList.add("right");
                    break;
            }
            switch (true) {
                case (i <= 2):
                    gameContainer.lastElementChild.classList.add("top");
                    break;
                case (i <= 5 && i > 2):
                    gameContainer.lastElementChild.classList.add("center");
                    break;
                case (i <= 8 && i > 5):
                    gameContainer.lastElementChild.classList.add("bottom");
                    break;
            }
        }
    };
    const applyMoveEvent = () => {
        let cellElements = document.querySelectorAll(".cells")
        for (let i = 0; i < cellElements.length; i++) {
            cellElements[i].addEventListener("click", (e) => {
                if ((e.target.textContent == "") && (victory.getVictor() === "")) {
                    gameProcess.getCurrentPlayer().submitMove(e.target)
                    e.target.style.color = gameProcess.getCurrentPlayer().getPlayerColor()
                    gameProcess.checkMove(e.target)
                    gameProcess.trackTurn()
                }
            })
        }
    }
    const getBoard = () => board
    return { setup, fillBoard, renderCell, applyMoveEvent, getBoard }
})();

const victory = (() => {
    const topHorizontal = [0, 1, 2];
    const centerHorizontal = [3, 4, 5];
    const bottomHorizontal = [6, 7, 8]
    const leftVertical = [0, 3, 6]
    const middleVertical = [1, 4, 7]
    const rightVertical = [2, 5, 8]
    const downDiagonal = [0, 4, 8]
    const upDiagonal = [6, 4, 2]
    let victor = ""
    const checkForWin = (arr) => {
        let checkArr = []
        for (let i = 0; i < arr.length; i++) {
            checkArr.push(gameBoard.getBoard()[arr[i]].getState())
        }
        let result = ""
        for (let i = 0; i<checkArr.length;i++) {
            result += checkArr[i];
        }
        if ((result === "OOO") || (result === "XXX")) {
            victor = gameProcess.getCurrentPlayer().getName();
            gameProcess.announceResults(victor);
        }
    }
    const getVictor = () => victor;
    return {
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
        switch(playerNum){
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
        playerList.push(players(prompt("input player 1 name"), "O", getColor(0)))
        playerList.push(players(prompt("input player 2 name"), "X", getColor(1)))
        gameProcess.trackTurn()
        gameBoard.fillBoard();
        gameBoard.renderCell();
        gameBoard.applyMoveEvent();
    }
    const trackTurn = () => {
        turn++
        if ((turn % 2) > 0) {
            changeCurrentPlayer(0)
        } else {
            changeCurrentPlayer(1)
        }
    }
    const getCurrentPlayer = () => currentPlayer
    const changeCurrentPlayer = (num) => currentPlayer = playerList[num]
    const checkMove = (location) => {
        //getting id of event target ("cell#"), and slicing off the number to change the corresponding cell object's state in addition to pushing the symbol to the DOM
        let cellId = gameBoard.getBoard()[location.id.slice(-1)];
        cellId.changeState(getCurrentPlayer().getSymbol());
        switch (true) {
            case (cellId.getId() === 1):
                victory.checkForWin(victory.topHorizontal)
                victory.checkForWin(victory.middleVertical)
                break;
            case (cellId.getId() === 2):
                victory.checkForWin(victory.topHorizontal)
                victory.checkForWin(victory.rightVertical)
                victory.checkForWin(victory.upDiagonal)
                break;
            case (cellId.getId() === 3):
                victory.checkForWin(victory.centerHorizontal)
                victory.checkForWin(victory.leftVertical)
                break;
            case (cellId.getId() === 4):
                victory.checkForWin(victory.topHorizontal)
                victory.checkForWin(victory.centerHorizontal)
                victory.checkForWin(victory.bottomHorizontal)
                victory.checkForWin(victory.leftVertical)
                victory.checkForWin(victory.middleVertical)
                victory.checkForWin(victory.rightVertical)
                victory.checkForWin(victory.upDiagonal)
                victory.checkForWin(victory.downDiagonal)
                break;
            case (cellId.getId() === 5):
                victory.checkForWin(victory.centerHorizontal)
                victory.checkForWin(victory.rightVertical)
                break;
            case (cellId.getId() === 6):
                victory.checkForWin(victory.bottomHorizontal)
                victory.checkForWin(victory.leftVertical)
                victory.checkForWin(victory.upDiagonal)
                break;
            case (cellId.getId() === 7):
                victory.checkForWin(victory.bottomHorizontal)
                victory.checkForWin(victory.middleVertical)
                break;
            case (cellId.getId() === 8):
                victory.checkForWin(victory.bottomHorizontal)
                victory.checkForWin(victory.rightVertical)
                victory.checkForWin(victory.downDiagonal)
                break;
            case (cellId.getId() === 0):
                victory.checkForWin(victory.topHorizontal)
                victory.checkForWin(victory.leftVertical)
                victory.checkForWin(victory.downDiagonal)
                break;
        }
    }
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