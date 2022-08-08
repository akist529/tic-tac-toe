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
            $("p").off("mouseenter");
            $("p").off("click");
            setTimeout(reset, 1000);

            switch(player.role) {
                case 'X':
                    $("#pOneScore").get(0).innerHTML = player.score;
                    break;
                default:
                    $("#pTwoScore").get(0).innerHTML = player.score;
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

        const container = Array.from($(".gameBoard").children());

        $("p").on({
            click: function() {
                const spaceNum = container.indexOf(this);

                if(Gameboard.spaces[spaceNum] !== "") {
                    return;
                }
                else {
                    Gameboard.spaces[spaceNum] = (playerOne.turn ? "X" : "O");
                    Gameboard.update(spaceNum);
                }
            },
            mouseenter: function() {
                $(this).css("background-color", "white");

                if($(this).html() === "") {
                    $(this).html((playerOne.turn) ? "X" : "O");
                }
            },
            mouseleave: function() {
                const spaceNum = container.indexOf(this);

                if(Gameboard.spaces[spaceNum] !== '') {
                    return;
                }
                else {
                    $(this).css("background-color", "black");
                    $(this).html("");
                }
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

        $("p").on({
            click: function() {
                const spaceNum = container.indexOf(this);

                if(Gameboard.spaces[spaceNum] !== "") {
                    return;
                }
                else {
                    Gameboard.spaces[spaceNum] = (playerOne.turn ? "X" : "O");
                    Gameboard.update(spaceNum);
                }
            },
            mouseenter: function() {
                $(this).css("background-color", "white");

                if($(this).html() === "") {
                    $(this).html((playerOne.turn) ? "X" : "O");
                }
            },
            mouseleave: function() {
                const spaceNum = container.indexOf(this);

                if(Gameboard.spaces[spaceNum] !== '') {
                    return;
                }
                else {
                    $(this).css("background-color", "black");
                    $(this).html("");
                }
            }
        });
    })();

    // Check the state of the board to see if the current player has won
    const checkWin = function(player, arr) {
        // Checks for tie (all cells filled with no winner)
        if (arr.every(cell => cell)) {
            for (let i = 0; i < arr.length; i++) {
                Array.from($(".gameBoard").children())[i].style.backgroundColor = "black";
                Array.from($(".gameBoard").children())[i].style.color = "white";
            }

            popup();

            return true;
        }

        // Checks horizontal rows for a win
        for (let i = 0; i < arr.length; i+= 3) {
            if (arr[i] === player.role && arr[(i + 1) % arr.length] === player.role && arr[(i + 2) % arr.length] === player.role) {
                player.score++;
                showWin(i, i + 1, i + 2);
                popup(player);
                return true;
            }
        }

        for (let i = 0; i < arr.length; i++) {
            // Checks vertical rows for a win
            if (arr[i] === player.role && arr[(i + 3) % arr.length] === player.role && arr[(i + 6) % arr.length] === player.role) {
                player.score++;
                showWin(i, i + 3, i + 6);
                popup(player);
                return true;
            }
            // Checks diagonal left-to-right for a win
            else if (arr[0] === player.role && arr[4] === player.role && arr[8] === player.role) {
                player.score++;
                showWin(0, 4, 8);
                popup(player);
                return true;
            }

            // Checks diagonal right-to-left for a win
            else if (arr[2] === player.role && arr[4] === player.role && arr[6] === player.role) {
                player.score++;
                showWin(2, 4, 6);
                popup(player);
                return true;
            }
        }

        function showWin(index1, index2, index3) {
            Array.from($(".gameBoard").children()[index1].style.backgroundColor = "black");
            Array.from($(".gameBoard").children()[index1].style.color = "white");
            Array.from($(".gameBoard").children()[index2].style.backgroundColor = "black");
            Array.from($(".gameBoard").children()[index2].style.color = "white");
            Array.from($(".gameBoard").children()[index3].style.backgroundColor = "black");
            Array.from($(".gameBoard").children()[index3].style.color = "white");
        }
    }

    const popup = function(player) {
        if (!player) {
            $("#popup-text").html("Tie!");
            $(".popup-container").css("display", "flex");
            setTimeout(() => { $(".popup-container").hide() }, 1000);
        }
        else if (player === playerOne) {
            $("#popup-text").html("Player 1 Wins!");
            $(".popup-container").css("display", "flex");
            setTimeout(() => { $(".popup-container").hide() }, 1000);
        }
        else if (player === playerTwo) {
            $("#popup-text").html("Player 2 Wins!");
            $(".popup-container").css("display", "flex");
            setTimeout(() => { $(".popup-container").hide() }, 1000);
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