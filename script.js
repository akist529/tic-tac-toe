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
        const $cell = Array.from($(".gameBoard").children())[index];
        $cell.innerHTML = (playerOne.turn ? "X" : "O");
        $cell.style.backgroundColor = "white";

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

                if (Gameboard.spaces[spaceNum] !== "") {
                    return;
                } else {
                    Gameboard.spaces[spaceNum] = (playerOne.turn ? "X" : "O");
                    Gameboard.update(spaceNum);
                }
            },
            mouseenter: function() {
                $(this).css("background-color", "white");

                if ($(this).html() === "") {
                    $(this).html((playerOne.turn) ? "X" : "O");
                }
            },
            mouseleave: function() {
                const spaceNum = container.indexOf(this);

                if (Gameboard.spaces[spaceNum] !== '') {
                    return;
                } else {
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
    setTimeout(() => {
        $("#popup-text").html("2-Player Mode or AI?");

        $(".popup-container").css("display", "flex");
        $(".popup-buttons").css("display", "flex");

        $(".popup").animate({
            opacity: "100%"
        }, 300);
    }, 1000);

    const playerTurn = (function() {
        const container = Array.from($(".gameBoard").children());

        $("p").on({
            click: function() {
                const spaceNum = container.indexOf(this);

                if (Gameboard.spaces[spaceNum] !== "") {
                    return;
                } else {
                    Gameboard.spaces[spaceNum] = (playerOne.turn ? "X" : "O");
                    Gameboard.update(spaceNum);
                }
            },
            mouseenter: function() {
                $(this).css("background-color", "white");

                if ($(this).html() === "") {
                    $(this).html((playerOne.turn) ? "X" : "O");
                }
            },
            mouseleave: function() {
                const spaceNum = container.indexOf(this);

                if (Gameboard.spaces[spaceNum] === "") {
                    $(this).css("background-color", "black");
                    $(this).html("");
                }
            }
        });
    })();

    /*
    const compTurn = function() {
        const container = Array.from($(".gameBoard").children());
        const spaceNum = container.indexOf(this);

        const move = Math.ceil(Math.random() * 8);

        for (let i = 0; i < container.length; i++) {
            if (Gameboard.spaces[spaceNum] !== "") {
                continue;
            } else {
                Gameboard.spaces[spaceNum] = ("O");
                Gameboard.update(spaceNum);
            }
        }
    }
    */

    const checkWin = function(player, arr) {
        // Checks horizontal rows for a win
        for (let i = 0; i < arr.length; i+= 3) {
            if (arr[i] === player.role && 
                arr[(i + 1) % arr.length] === player.role && 
                arr[(i + 2) % arr.length] === player.role)
            {
                player.score++;
                showWin(i, i + 1, i + 2);
                setTimeout(() => popUp(player), 750);
                return true;
            }
        }

        for (let i = 0; i < arr.length; i++) {
            // Checks vertical rows for a win
            if (arr[i] === player.role && 
                arr[(i + 3) % arr.length] === player.role && 
                arr[(i + 6) % arr.length] === player.role)
            {
                player.score++;
                showWin(i, i + 3, i + 6);
                setTimeout(() => popUp(player), 750);
                return true;
            }
            // Checks diagonal left-to-right for a win
            else if (arr[0] === player.role && 
                arr[4] === player.role && 
                arr[8] === player.role)
            {
                player.score++;
                showWin(0, 4, 8);
                setTimeout(() => popUp(player), 750);
                return true;
            }

            // Checks diagonal right-to-left for a win
            else if (arr[2] === player.role && 
                arr[4] === player.role && 
                arr[6] === player.role)
            {
                player.score++;
                showWin(2, 4, 6);
                setTimeout(() => popUp(player), 750);
                return true;
            }
        }

        // Checks for tie (all cells filled with no winner)
        if (arr.every(cell => cell)) {
            for (let i = 0; i < arr.length; i++) {
                const $cell = Array.from($(".gameBoard").children())[i];
                $cell.style.backgroundColor = "black";
                $cell.style.color = "white";
            }

            setTimeout(() => popUp(), 750);
            return true;
        }

        function showWin(index1, index2, index3) {
            for (let i = 0; i < arguments.length; i++) {
                const $cell = Array.from($(".gameBoard").children())[arguments[i]];
                $cell.style.backgroundColor = "black";
                $cell.style.color = "white";
            }
        }
    }

    const popUp = function(player) {
        if (!player) {
            $("#popup-text").css("display", "block");
            $("#popup-text").html("Tie!");

            $(".popup-container").css("display", "flex");

            $(".popup").animate({
                opacity: "100%"
            }, "slow");

            setTimeout(() => {
                $(".popup").animate({
                    opacity: "0%"
                }, 300);
                setTimeout(() => { $(".popup-container").hide() }, 300);
            }, 1200);
        }
        else if (player === playerOne) {
            $("#popup-text").css("display", "block");
            $("#popup-text").html(`${player.name} Wins!`);

            $(".popup-container").css("display", "flex");

            $(".popup").animate({
                opacity: "100%"
            }, 300);
            
            setTimeout(() => {
                $(".popup").animate({
                    opacity: "0%"
                }, 300);
                setTimeout(() => { $(".popup-container").hide() }, 300);
            }, 1200);
        }
        else if (player === playerTwo) {
            $("#popup-text").css("display", "block");
            $("#popup-text").html(`${player.name} Wins!`);

            $(".popup-container").css("display", "flex");

            $(".popup").animate({
                opacity: "100%"
            }, "slow");
            
            setTimeout(() => {
                $(".popup").animate({
                    opacity: "0%"
                }, 300);
                setTimeout(() => { $(".popup-container").hide() }, 300);
            }, 1200);
        }
    }

    const playerInputs = function() {
        $("#popup-text").css("display", "none");
        $(".popup-buttons").css("display", "none");
        $(".popup-inputs").css("display", "flex");
        $("#playerStart").css("display", "block");
    }

    const compInputs = function() {
        $("#popup-text").css("display", "none");
        $(".popup-buttons").css("display", "none");
        $(".popup-inputs").css("display", "flex");
        $(".popup-inputs div:nth-child(2)").css("display", "none");
        $("#compStart").css("display", "block");
    }

    const playerMode = function() {
        if (!$("#playerOne").val()) {
            $("#pOneName").html("Player 1");
            playerOne.name = "Player 1";
        } else {
            $("#pOneName").html($("#playerOne").val());
            playerOne.name = $("#playerOne").val();
        }

        if (!$("#playerTwo").val()) {
            $("#pTwoName").html("Player 2");
            playerTwo.name = "Player 2";
        } else {
            $("#pTwoName").html($("#playerTwo").val());
            playerTwo.name = $("#playerTwo").val();
        }

        $("#playerOne").val("");
        $("#playerTwo").val("");

        $(".popup-inputs").css("display", "none");
        $(".popup-container").css("display", "none");
    }

    const compMode = function() {
        if (!$("#playerOne").val()) {
            $("#pOneName").html("Player");
            playerOne.name = "Player";
        } else {
            $("#pOneName").html($("#playerOne").val());
            playerOne.name = $("#playerOne").val();
        }

        $("#playerOne").val("");

        $("#pTwoName").html("Computer");
        playerTwo.name = "Computer";
        playerTwo.isAI = "true";

        $(".popup-inputs").css("display", "none");
        $(".popup-container").css("display", "none");
    }

    return {
        checkWin,
        playerInputs,
        compInputs,
        playerMode,
        compMode
    }
})();

var Player = (role, turn, score, isAI) => {
    return {
        role,
        turn,
        score,
        isAI
    };
};

var playerOne = Player('X', true, 0, false);
var playerTwo = Player('O', false, 0, false);