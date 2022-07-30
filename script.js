const Gameboard = (() => {
    const spaces = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'];
    const render = function() {
        for (let i = 0; i < spaces.length; i++) {
            $(".gameBoard").append(`<p>${spaces[i]}</p>`);
        }
    }

    return {
        spaces,
        render
    };
})();

var displayController = (() => {
    const spaces = Gameboard.spaces;
    var board = [];

    for (const space in spaces) {
        board.push
    }

    return {
        board
    }
})();

var Player = (role) => {
    return {
        role
    };
};

var playerOne = Player('X');
var playerTwo = Player('O');

console.log(playerOne);
console.log(playerTwo);

Gameboard.render();