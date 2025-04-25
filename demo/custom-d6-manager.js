let customD6Manager;

function initCustomD6Manager(BgaDice) {
    customD6Manager = new BgaDice.Manager({
        animationManager: animationManager,
        setupDieDiv(die, element) {
            element.classList.add('takenokolor-die');
            element.style.setProperty('--color', die.color);

            const faces = element.firstElementChild;

            for (let face = 1; face <= 6; face++) {
                const penSide = document.createElement('div');
                penSide.classList.add('pen-face', 'pen-side');
                penSide.dataset.face = face;
                faces.appendChild(penSide);
            }
        },

        setupFaceDiv(die, element, face) {
            element.innerText = `face ${face}`;
        },
    });
}
