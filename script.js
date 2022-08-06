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
        Array.from($(".gameBoard").children())[index].style.backgroundColor = "white";

        const player = (playerOne.turn ? playerOne: playerTwo);

        if (displayController.checkWin(player, spaces)) {
            reset();

            switch(player.role) {
                case 'X':
                    $("#pOneScore").get(0).innerHTML = player.score;
                    break;
                case 'O':
                    $("#pTwoScore").get(0).innerHTML = player.score;
                    break;
                default:
                    break;
            }

            return;
        }

        playerOne.turn = !playerOne.turn;
        playerTwo.turn = !playerTwo.turn;
    }

    const reset = function() {
        for (let i = 0; i < 9; i++) {
            spaces[i] = '';
        }

        for (const space of Array.from($(".gameBoard").children())) {
            space.innerHTML = '';
            space.style.backgroundColor = "black";
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
                player.score++;
                return true;
            }

            // Checks diagonal left-to-right for a win
            if (arr[0] === player.role && arr[4] === player.role && arr[8] === player.role) {
                player.score++;
                return true;
            }

            // Checks diagonal right-to-left for a win
            if (arr[2] === player.role && arr[4] === player.role && arr[6] === player.role) {
                player.score++;
                return true;
            }
        }

        // Checks horizontal rows for a win
        for (let i = 0; i < arr.length; i+= 3) {
            if (arr[i] === player.role && arr[(i + 1) % arr.length] === player.role && arr[(i + 2) % arr.length] === player.role) {
                player.score++;
                return true;
            }
        }

        // Checks for tie (all cells filled with no winner)
        if (arr.every(cell => cell)) {
            return true;
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

var playerOne = Player('X', true, 0);
var playerTwo = Player('O', false, 0);