const Gameboard = (() => {
    const spaces = ['', '', '', '', '', '', '', '', ''];
    const render = function() {
        for (let i = 0; i < spaces.length; i++) {
            const txt = `<p>${spaces[i]}</p>`;
            const id = `spc${i}`;
            $(".gameBoard").append(`<p>${spaces[i]}</p>`);
        }
    };
    const update = function(index) {
        Array.from($(".gameBoard").children())[index].innerHTML = (playerOne.turn ? "X" : "O");
        playerOne.turn = !playerOne.turn;
        playerTwo.turn = !playerTwo.turn;
    }

    return {
        spaces,
        render,
        update
    };
})();

const Displaycontroller = (() => {
    const takeTurn = function() {
        const container = Array.from($(".gameBoard").children());

        $("p").click(function() {
            const spaceNum = container.indexOf(this);

            if(Gameboard.spaces[spaceNum] !== '') {
                return;
            }
            else {
                Gameboard.spaces[spaceNum] = (playerOne.turn ? 'X' : 'O');
                Gameboard.update(spaceNum);
            }
        });
    }

    return {
        takeTurn
    }
})();

var Player = (role, turn, score) => {
    return {
        role,
        turn,
        score
    };
};

var playerOne = Player('X', true);
var playerTwo = Player('O', false);

Gameboard.render();
Displaycontroller.takeTurn();