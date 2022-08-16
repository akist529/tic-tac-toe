const GameBoard = (() => {
    var spaces = [];

    for (let i = 0; i < 9; i++) {
        spaces.push('');
    }

    const render = (function() {
        for (let i = 0; i < spaces.length; i++) {
            const cell = $("<p></p>").text(`${spaces[i]}`);
            cell.addClass("light-border");
            $(".gameBoard").append(cell);
        }
    })();

    const update = function(index) {
        const cell = Array.from($(".gameBoard").children())[index];

        cell.textContent = (playerOne.turn ? "X" : "O");
        cell.style.backgroundColor = "white";

        const player = (playerOne.turn ? playerOne: playerTwo);

        if (DisplayController.checkWin(player, spaces)) {
            player.score++;
            setTimeout(reset, 1000);

            switch(player.role) {
                case 'X':
                    $("#pOneScore").text(Number($("#pOneScore").text()) + 1);
                    break;
                default:
                    $("#pTwoScore").text(Number($("#pTwoScore").text()) + 1);
            }

            return;
        }

        playerOne.turn = !playerOne.turn;
        playerTwo.turn = !playerTwo.turn;

        if (playerTwo.turn && playerTwo.isAI) {
            DisplayController.compTurn();
        }
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

                if (GameBoard.spaces[spaceNum] !== "") {
                    return;
                } else {
                    GameBoard.spaces[spaceNum] = (playerOne.turn ? "X" : "O");
                    GameBoard.update(spaceNum);
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

                if (GameBoard.spaces[spaceNum] !== '') {
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

const DisplayController = (() => {
    setTimeout(() => {
        $("#popup-text").html("2-Player Mode or AI?");

        $(".popup-container").css("display", "flex");
        $("button:contains('Start Game')").hide();

        $(".popup-window").animate({
            opacity: "100%"
        }, 300);
    }, 1000);

    const playerTurn = (function() {
        const container = Array.from($(".gameBoard").children());

        $("p").on({
            click: function() {
                const spaceNum = container.indexOf(this);

                if (GameBoard.spaces[spaceNum] !== "") {
                    return;
                } else {
                    GameBoard.spaces[spaceNum] = (playerOne.turn ? "X" : "O");
                    GameBoard.update(spaceNum);
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

                if (GameBoard.spaces[spaceNum] === "") {
                    $(this).css("background-color", "black");
                    $(this).html("");
                }
            }
        });
    })();

    const compTurn = function() {
        const container = Array.from($(".gameBoard").children());

        Array.prototype.random = function() {
            return this[Math.floor(Math.random() * this.length)];
        }

        let move;

        GameBoard.update((function() {
            function checkBoard(index) {
                return GameBoard.spaces[index] === "";
            }

            if (checkBoard(4)) {
                GameBoard.spaces[4] = "O";
                return 4;
            } else if ([0,2,6,8].some(checkBoard)) {
                while (true) {
                    move = [0,2,6,8].random();

                    if (checkBoard(move)) {
                        GameBoard.spaces[move] = "O";
                        return move;
                    }
                }
            } else {
                while (true) {
                    move = [1,3,5,7].random();

                    if (checkBoard(move)) {
                        GameBoard.spaces[move] = "O";
                        return move;
                    }
                }
            }
        })());
    }

    const checkWin = function(player, arr) {
        // Checks horizontal rows for a win
        for (let i = 0; i < arr.length; i+= 3) {
            if (arr[i] === player.role && 
                arr[(i + 1) % arr.length] === player.role && 
                arr[(i + 2) % arr.length] === player.role)
            {
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
                showWin(i, i + 3, i + 6);
                setTimeout(() => popUp(player), 750);
                return true;
            }
            // Checks diagonal left-to-right for a win
            else if (arr[0] === player.role && 
                arr[4] === player.role && 
                arr[8] === player.role)
            {
                showWin(0, 4, 8);
                setTimeout(() => popUp(player), 750);
                return true;
            }

            // Checks diagonal right-to-left for a win
            else if (arr[2] === player.role && 
                arr[4] === player.role && 
                arr[6] === player.role)
            {
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
            $("p").off("mouseenter click");

            for (let i = 0; i < arguments.length; i++) {
                const $cell = Array.from($(".gameBoard").children())[arguments[i]];
                $cell.style.backgroundColor = "black";
                $cell.style.color = "white";
            }
        }
    }

    const popUp = function(player) {
        if (!player) {
            $(".popup-container").css("display", "flex");
            $("#popup-text").show().html("Tie!");

            $(".popup-window").animate({
                opacity: "100%"
            }, 300);

            setTimeout(() => {
                $(".popup-window").animate({
                    opacity: "0%"
                }, 300);
                setTimeout(() => { 
                    $(".popup-container").hide()
                }, 300);
            }, 1200);
        }
        else if (player === playerOne) {
            $(".popup-container").css("display", "flex");
            $("#popup-text").show().html(`${player.name} Wins!`);

            $(".popup-window").animate({
                opacity: "100%"
            }, 300);
            
            setTimeout(() => {
                $(".popup-window").animate({
                    opacity: "0%"
                }, 300);
                setTimeout(() => { 
                    $(".popup-container").hide() 
                }, 300);
            }, 1200);
        }
        else if (player === playerTwo) {
            $(".popup-container").css("display", "flex");
            $("#popup-text").show().html(`${player.name} Wins!`);

            $(".popup-window").animate({
                opacity: "100%"
            }, 300);
            
            setTimeout(() => {
                $(".popup-window").animate({
                    opacity: "0%"
                }, 300);
                setTimeout(() => { 
                    $(".popup-container").hide() 
                }, 300);
            }, 1200);
        }
    }

    const playerInputs = function() {
        $("#popup-text, .popup-window button").hide();
        $(".popup-inputs").css("display", "flex");
        $("button[onClick*='playerMode()']").show();
    }

    const compInputs = function() {
        $("#popup-text, .popup-window button").hide();
        $(".popup-inputs").css("display", "flex");
        $(".popup-inputs").children().eq(1).hide();
        $("button[onClick*='compMode()']").show();
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

        $("#playerOne, #playerTwo").val("");
        $(".popup-inputs, .popup-container").hide();
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
        playerTwo.isAI = true;

        $(".popup-inputs, .popup-container").hide()
    }

    return {
        checkWin,
        playerInputs,
        compInputs,
        playerMode,
        compMode,
        compTurn
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