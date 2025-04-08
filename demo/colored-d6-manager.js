let d6Manager;
class ColoredDie6 extends BgaDie6 {
    color;

    constructor(color) {
        super({ borderRadius: 12 });
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

class KoTDie6 extends BgaDie6 {
    size = 80;

    constructor() {
        super({ borderRadius: 12 });
    }

    setupDieDiv(die, element) {
        super.setupDieDiv(die, element);
        element.classList.add('kot-die6');
    }

    setupFaceDiv(die, element, face) {

    }
}

function initD6Manager() {
    d6Manager = new DiceManager(game, {
        dieTypes: {
            'white': new ColoredDie6(0),
            'red': new ColoredDie6(1),
            'yellow': new ColoredDie6(2),
            'green': new ColoredDie6(3),
            'blue': new ColoredDie6(4),
        },
    });
}
