let customD6Manager;

function initCustomD6Manager() {
    customD6Manager = new DiceManager(game, {
        dieTypes: {
            'takenokolor': new TakenokolorDie(),
        },
    });
}
