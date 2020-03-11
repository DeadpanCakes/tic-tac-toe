const players = function (name, symbol) {
    const getName = () => name;
    const submitMove = function (location) {
        return location.textContent = symbol;
    }
    return { getName, submitMove }
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
            switch(i%3) {
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
            switch(true) {
                case (i<=2):
                    gameContainer.lastElementChild.classList.add("top");
                    break;
                case (i<=5 && i>2):
                    gameContainer.lastElementChild.classList.add("center");
                    break;
                case (i<=8 && i>5):
                    gameContainer.lastElementChild.classList.add("bottom");
                    break;
            }
        }
    };
    const applyEvent = () => {
        let cellElements = document.querySelectorAll(".cells")
        for (let i = 0; i < cellElements.length; i++) {
            cellElements[i].addEventListener("click", (e) => {
                if (e.target.textContent == "") {
                    gameProcess.getCurrentPlayer().submitMove(e.target)
                    gameProcess.trackTurn()
                }
            })
        }
    }
    const getBoard = () => board
    return { fillBoard, renderCell, applyEvent, getBoard }
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
        console.log(turn)
        turn++
        if ((turn%2)>0) {
            changeCurrentPlayer(0)
            console.log(currentPlayer)
        } else {
            changeCurrentPlayer(1)
            console.log(currentPlayer)
        }
    }
    const getCurrentPlayer = () => currentPlayer
    const changeCurrentPlayer = (num) => currentPlayer = playerList[num]
    const checkMove = () => {

    }
    const announceResults = () => {

    }
    return { init, trackTurn, getCurrentPlayer, changeCurrentPlayer, checkMove, announceResults }
})();