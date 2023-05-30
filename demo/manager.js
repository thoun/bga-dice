let diceManager;

class WhiteDie extends Die6 {
    color;

    constructor(color) {
        super();
        this.color = color;
    }

    setupDieDiv(die, element) {
        element.classList.add('white-die');
    }

    setupFaceDiv(die, element, face) {

    }
}

function initManager() {
    diceManager = new DiceManager(game, {
        dieTypes: {
            0: new WhiteDie(),
        },
    });
}

let dieId = 1;
function getDieId() {
    return dieId++;
}