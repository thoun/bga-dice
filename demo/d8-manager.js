let d8Manager;

function initD8Manager() {
    d8Manager = new BgaDice.Manager({
        animationManager: animationManager,
        type: 'blue-d8',
        faces: 8,
        size: 200,
        setupFaceDiv(die, element, face) {
            element.innerText = face;
        }
    });
}
