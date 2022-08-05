const Gameboard = (() => {
    var spaces = [];

    for (let i = 0; i < 9; i++) {
        spaces.push('');
    }

    const render = (function() {
        for (let i = 0; i < spaces.length; i++) {
            const space = `<p>${spaces[i]}</p>`;
            $(".gameBoard").append(space);
        }
    })();

    const update = function(index) {
        Array.from($(".gameBoard").children())[index].innerHTML = (playerOne.turn ? "X" : "O");

        if (displayController.checkWin((playerOne.turn ? playerOne : playerTwo), spaces)) {
            reset();
            return;
        }

        playerOne.turn = !playerOne.turn;
        playerTwo.turn = !playerTwo.turn;
    }

    const reset = function() {
        Gameboard.spaces = [];

        for (let i = 0; i < 9; i++) {
            Gameboard.spaces.push('');
        }

        for (const space of $(".gameBoard").children()) {
            space.innerHTML = '';
        }
    }

    return {
        spaces,
        reset,
        update
    };
})();

const displayController = (() => {
    // Mark space for player if it's not already taken
    const playerTurn = (function() {
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
    })();

    // Check the state of the board to see if the current player has won
    const checkWin = function(player, arr) {
        for (let i = 0; i < arr.length; i++) {
            // Checks vertical rows for a win
            if (arr[i] === player.role && arr[(i + 3) % arr.length] === player.role && arr[(i + 6) % arr.length] === player.role) {
                console.log("Win Condition 1");
                return true;
            }

            // Checks diagonal left-to-right for a win
            if (arr[0] === player.role && arr[4] === player.role && arr[8] === player.role) {
                console.log("Win Condition 3");
                return true;
            }

            // Checks diagonal right-to-left for a win
            if (arr[2] === player.role && arr[4] === player.role && arr[6] === player.role) {
                console.log("Win Condition 4");
                return true;
            }
        }

        // Checks horizontal rows for a win
        for (let i = 0; i < arr.length; i+= 3) {
            if (arr[i] === player.role && arr[(i + 1) % arr.length] === player.role && arr[(i + 2) % arr.length] === player.role) {
                console.log("Win Condition 2");
                return true;
            }
        }

        // Checks for tie (all cells filled with no winner)
        if (arr.every(cell => cell)) {
            console.log("Tie!");
        }
    }

    return {
        checkWin
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