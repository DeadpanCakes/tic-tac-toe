const player = function() {
    let symbol;
    let name;
    const updateInfo = str => name = str;
    const submitMove = function() {
    }
    return {submitMove, updateInfo}
}

const spaces = () => { 
    let state
    let id;
    const render = () => {
    };
    const changeState = symbol => state = symbol;
    return {render, changeState};
}

const gameBoard = (() => {
    const board = [];
    const render = () => {
        for(let i = 0;i<board.length;i++){
            board[i]
        }
    }
})();

const Process = (() => {
    const receiveMove = () => {

    }
    const checkMove = () => {

    }
    const announceResults = () => {

    }
    return{receiveMove,checkMove,announceResults}
})();