let d6Manager;

function initD6Manager() {
    d6Manager = new DiceManager(game, {
        type: 'colored-die',
        borderRadius: 12,

        setupDieDiv(die, element) {
            element.dataset.color = die.color;
        }
    });
}
