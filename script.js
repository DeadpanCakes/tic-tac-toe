const players = function (name, symbol) {
    const getName = () => name;
    const getSymbol = () => symbol;
    const submitMove = function (location) {
        return location.textContent = getSymbol();
    }
    return { getName, getSymbol, submitMove }
}

const cells = (id) => {
    let state;
    const getId = () => id;
    const getState = () => state;
    const changeState = symbol => state = symbol;
    return { getId, getState, changeState };
}

const gameBoard = (() => {
    const board = [];
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
    const applyEvent = () => {
        let cellElements = document.querySelectorAll(".cells")
        for (let i = 0; i < cellElements.length; i++) {
            cellElements[i].addEventListener("click", (e) => {
                if ((e.target.textContent == "") && (victory.getVictor() === "")) {
                    gameProcess.getCurrentPlayer().submitMove(e.target)
                    gameProcess.checkMove(e.target)
                    gameProcess.trackTurn()
                }
            })
        }
    }
    const getBoard = () => board
    return { fillBoard, renderCell, applyEvent, getBoard }
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
    const init = () => {
        playerList.push(players(prompt(), "O"))
        playerList.push(players(prompt(), "X"))
        gameProcess.trackTurn()
        gameBoard.fillBoard();
        gameBoard.renderCell();
        gameBoard.applyEvent();
    }
    let turn = 0;
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
    return { init, trackTurn, getCurrentPlayer, changeCurrentPlayer, checkMove, announceResults }
})();