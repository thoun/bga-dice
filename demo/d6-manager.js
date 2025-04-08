let d6Manager;

class WhiteDie extends BgaDie6 {
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

function initD6Manager() {
    d6Manager = new DiceManager(game, {
        dieTypes: {
            0: new WhiteDie(),
        },
    });
}
