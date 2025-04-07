interface DieAnimation {
    /**
     * The stock to take the die. It will automatically remove the die from the other stock.
     */
    fromStock?: DiceStock;

    /**
     * The element to move the die from.
     */
    fromElement?: HTMLElement;

    /**
     * The side before animation.
     */
    originalSide?: 'front' | 'back';

    /**
     * If the die is rotated at the start of animation.
     */
    rotationDelta?: number;
}

interface DieAnimationSettings {

    /**
     * The side before animation.
     */
    originalSide?: 'front' | 'back';

    /**
     * If the die is rotated at the start of animation.
     */
    rotationDelta?: number;
}
