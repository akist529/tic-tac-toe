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
            setTimeout(resetBoard, 1000);

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

    const resetBoard = function() {
        playerOne.turn = true;
        playerTwo.turn = false;

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
        resetBoard,
        update
    };
})();

const DisplayController = (() => {
    const startGame = function() {
        $("#popup-text").show().html("2-Player Mode or AI?");
        $(".popup-buttons").children().show();

        $(".popup-container").css("display", "flex");
        $("button:contains('Start Game')").hide();

        $(".popup-window").animate({
            opacity: "100%"
        }, 300);
    };

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
        Array.prototype.random = function() {
            return this[Math.floor(Math.random() * this.length)];
        }

        GameBoard.update((function() {
            function checkBoard(index) {
                return GameBoard.spaces[index] === "";
            }

            if (checkBoard(4)) {
                GameBoard.spaces[4] = "O";
                return 4;
            } else if ([0,2,6,8].some(checkBoard)) {
                while (true) {
                    let move = [0,2,6,8].random();

                    if (checkBoard(move)) {
                        GameBoard.spaces[move] = "O";
                        return move;
                    }
                }
            } else {
                while (true) {
                    let move = [1,3,5,7].random();

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
        $(".popup-container").css("display", "flex");
        $(".popup-buttons").children().hide();

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

        if (!player) {
            $("#popup-text").show().html("Tie!");
        } else {
            $("#popup-text").show().html(`${player.name} Wins!`);
        }
    }

    const inputMode = function(event) {
        $("#popup-text, .popup-window button").hide();
        $(".popup-inputs").css("display", "flex");
        $("button[onClick*='inputNames()']").show();

        if (event.explicitOriginalTarget.textContent === "AI") {
            $(".popup-inputs").children().eq(1).hide();
            playerTwo.isAI = true;
        } else {
            $(".popup-inputs").children().eq(1).show();
            playerTwo.isAI = false;
        }
    }

    const inputNames = function() {
        GameBoard.resetBoard();
        playerOne.score = 0;
        playerTwo.score = 0;
        $("#pOneScore, #pTwoScore").text("0");

        if (!$("#playerOne").val()) {
            $("#pOneName").html("Player 1");
            playerOne.name = "Player 1";
        } else {
            $("#pOneName").html($("#playerOne").val());
            playerOne.name = $("#playerOne").val();
        }

        if (playerTwo.isAI) {
            $("#pTwoName").html("Computer");
            playerTwo.name = "Computer";
        } else if (!$("#playerTwo").val()) {
            $("#pTwoName").html("Player 2");
            playerTwo.name = "Player 2";
        } else {
            $("#pTwoName").html($("#playerTwo").val());
            playerTwo.name = $("#playerTwo").val();
        }

        $("#playerOne, #playerTwo").val("");
        $(".popup-inputs, .popup-container").hide();
    }

    const resetGame = function(event) {
        playerOne.score = 0;
        playerTwo.score = 0;
        $("#pOneScore, #pTwoScore").text("0");
        GameBoard.resetBoard();
        
        if (event.explicitOriginalTarget.textContent === "Change Mode") {
            DisplayController.startGame();
        } 
    }

    return {
        checkWin,
        inputMode,
        inputNames,
        compTurn,
        startGame,
        resetGame
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

setTimeout(() => {
    DisplayController.startGame();
}, 1000);