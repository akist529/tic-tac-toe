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
        Array.from($(".gameBoard").children())[index].innerHTML = "X";
    }

    return {
        spaces,
        render,
        update
    };
})();

const Displaycontroller = (() => {
    const alert = function() {
        const container = Array.from($(".gameBoard").children());

        $("p").click(function() {
            const spaceNum = container.indexOf(this);
            Gameboard.spaces[spaceNum] = 'X';
            Gameboard.update(spaceNum);
        });
    }

    return {
        alert
    }
})();

var Player = (role) => {
    return {
        role
    };
};

var playerOne = Player('X');
var playerTwo = Player('O');

Gameboard.render();
Displaycontroller.alert();