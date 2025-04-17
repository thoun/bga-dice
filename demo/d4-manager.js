let d4Manager;

const BGA_DIE4_FACE_NUMBERS = {
    1: [2, 4, 3],
    2: [1, 3, 4],
    3: [1, 4, 2],
    4: [1, 2, 3],
};

function initD4Manager() {
    d4Manager = new BgaDice.Manager({
        animationManager: animationManager,
        type: 'kot-die4',
        faces: 4,
        size: 150,
        setupFaceDiv(die, element, face) {
            for (let i = 0; i < 3; i++) {
                const number = document.createElement('div');
                number.classList.add('bga-dice_die-face-number');
                number.dataset.number = `${BGA_DIE4_FACE_NUMBERS[face][i]}`;
                element.appendChild(number);
            }
        }
    });
}
