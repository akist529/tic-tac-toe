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
            setTimeout(reset, 1000);

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

        for (const cell of $("p")) {
            cell.innerHTML = "";
            cell.style.backgroundColor = "black";
            cell.style.color = "black";
        }

        $("p").hover(function() {
            $(this).css("background-color", "white");
        }, function() {
            const spaceNum = container.indexOf(this);

            if(Gameboard.spaces[spaceNum] !== '') {
                return;
            }
            else {
                $(this).css("background-color", "black");
            }
        });

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

        $("p").hover(function() {
            const spaceNum = container.indexOf(this);

            if(Gameboard.spaces[spaceNum] !== '') {
                return;
            }
            else {
                Array.from($(".gameBoard").children()[spaceNum].innerHTML = (playerOne.turn ? 'X' : 'O'));
            }
        });
    })();

    // Check the state of the board to see if the current player has won
    const checkWin = function(player, arr) {
        for (let i = 0; i < arr.length; i++) {
            // Checks vertical rows for a win
            if (arr[i] === player.role && arr[(i + 3) % arr.length] === player.role && arr[(i + 6) % arr.length] === player.role) {
                player.score++;
                Array.from($(".gameBoard").children()[i].style.backgroundColor = "black");
                Array.from($(".gameBoard").children()[i].style.color = "white");
                Array.from($(".gameBoard").children()[i + 3].style.backgroundColor = "black");
                Array.from($(".gameBoard").children()[i + 3].style.color = "white");
                Array.from($(".gameBoard").children()[i + 6].style.backgroundColor = "black");
                Array.from($(".gameBoard").children()[i + 6].style.color = "white");
                return true;
            }

            // Checks diagonal left-to-right for a win
            if (arr[0] === player.role && arr[4] === player.role && arr[8] === player.role) {
                player.score++;
                Array.from($(".gameBoard").children()[0].style.backgroundColor = "black");
                Array.from($(".gameBoard").children()[0].style.color = "white");
                Array.from($(".gameBoard").children()[4].style.backgroundColor = "black");
                Array.from($(".gameBoard").children()[4].style.color = "white");
                Array.from($(".gameBoard").children()[8].style.backgroundColor = "black");
                Array.from($(".gameBoard").children()[8].style.color = "white");
                return true;
            }

            // Checks diagonal right-to-left for a win
            if (arr[2] === player.role && arr[4] === player.role && arr[6] === player.role) {
                player.score++;
                Array.from($(".gameBoard").children()[2].style.backgroundColor = "black");
                Array.from($(".gameBoard").children()[2].style.color = "white");
                Array.from($(".gameBoard").children()[4].style.backgroundColor = "black");
                Array.from($(".gameBoard").children()[4].style.color = "white");
                Array.from($(".gameBoard").children()[6].style.backgroundColor = "black");
                Array.from($(".gameBoard").children()[6].style.color = "white");
                return true;
            }
        }

        // Checks horizontal rows for a win
        for (let i = 0; i < arr.length; i+= 3) {
            if (arr[i] === player.role && arr[(i + 1) % arr.length] === player.role && arr[(i + 2) % arr.length] === player.role) {
                player.score++;
                Array.from($(".gameBoard").children()[i].style.backgroundColor = "black");
                Array.from($(".gameBoard").children()[i].style.color = "white");
                Array.from($(".gameBoard").children()[i + 1].style.backgroundColor = "black");
                Array.from($(".gameBoard").children()[i + 1].style.color = "white");
                Array.from($(".gameBoard").children()[i + 2].style.backgroundColor = "black");
                Array.from($(".gameBoard").children()[i + 2].style.color = "white");
                return true;
            }
        }

        // Checks for tie (all cells filled with no winner)
        if (arr.every(cell => cell)) {
            for (const cell in Array.from($(".gameBoard").children())) {
                cell.style.backgroundColor = "black";
                cell.style.color = "white";
                cell.style.backgroundColor = "black";
                cell.style.color = "white";
                cell.style.backgroundColor = "black";
                cell.style.color = "white";
            }

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