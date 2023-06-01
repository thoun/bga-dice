let diceManager;

class ColoredDie6 extends Die6 {
    color;

    constructor(color) {
        super(10);
        this.color = color;
    }

    setupDieDiv(die, element) {
        super.setupDieDiv(die, element);
        element.classList.add('colored-die');
        element.dataset.color=''+this.color;
    }

    setupFaceDiv(die, element, face) {

    }
}

function initManager() {
    diceManager = new DiceManager(game, {
        dieTypes: {
            'white': new ColoredDie6(0),
            'red': new ColoredDie6(1),
            'yellow': new ColoredDie6(2),
            'green': new ColoredDie6(3),
            'blue': new ColoredDie6(4),
        },
    });
}

let dieId = 1;
function getDieId() {
    return dieId++;
}