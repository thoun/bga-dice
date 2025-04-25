let d6Manager;

function initD6Manager(BgaDice) {
    d6Manager = new BgaDice.Manager({
        animationManager: animationManager,
        type: 'colored-die',
        borderRadius: 12,

        setupDieDiv(die, element) {
            element.dataset.color = die.color ?? 'white';
        }
    });
}
