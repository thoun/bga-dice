let d4Manager;

class KoTDie4 extends BgaDie4 {
    size = 150;

    constructor() {
        super();
    }

    setupDieDiv(die, element) {
        super.setupDieDiv(die, element);
        element.classList.add('kot-die4');
    }

    setupFaceDiv(die, element, face) {
        super.setupFaceDiv(die, element, face);
    }
}


function initD4Manager() {
    d4Manager = new DiceManager(game, {
        dieTypes: {
            'white': new ColoredDie6(0),
            'red': new ColoredDie6(1),
            'yellow': new ColoredDie6(2),
            'green': new ColoredDie6(3),
            'blue': new ColoredDie6(4),
            'kot6': new KoTDie6(),
            'kot4': new KoTDie4(),
            'd8': new NumberedDie8(),
        },
    });
}
