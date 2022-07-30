const Gameboard = (() => {
    const spaces = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'];
    const render = function() {
        for (let i = 0; i < spaces.length; i++) {
            $(".gameBoard").append(`<p>${spaces[i]}</p>`);
        }
    };

    return {
        spaces,
        render
    };
})();

var displayController = (() => {
    $("p").click(function() {
        alert("Clicked!");
    });
})();

var Player = (role) => {
    return {
        role
    };
};

var playerOne = Player('X');
var playerTwo = Player('O');

Gameboard.render();

console.log(displayController);