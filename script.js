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
            gameContainer.lastElementChild.id = i
        }
    };
    const applyEvent = () => {
        let cellElements = document.querySelectorAll(".cells")
        for (let i = 0; i < cellElements.length; i++) {
            cellElements[i].addEventListener("click", (e) => currentPlayer.submitMove(e));
            // cellElements[i].addEventListener("click", (e) => console.log(gameProcess.getTest()));
        }
    }
    const getBoard = () => board
    return { fillBoard, renderCell, applyEvent, getBoard }
})();

const gameProcess = (() => {
    // let test = "test"
    const init = () => {
        gameBoard.fillBoard();
        gameBoard.renderCell();
        gameBoard.applyEvent();
    }
    // const changeTest = (str) => test = str;
    // const getTest = () => test
    let turn = 0;
    const trackTurn = () => {
        turn++
        if (turn%2>1) {
            currentPlayer = playerList[0]
        } else {
            currentPlayer = playerList[1]
        }
    }
    const receiveMove = () => {

    }
    const checkMove = () => {

    }
    const announceResults = () => {

    }
    return { changeTest, getTest, init, trackTurn, receiveMove, checkMove, announceResults }
})();