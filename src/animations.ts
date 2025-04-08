interface DieAnimationSettings extends SlideAnimationSettings {
    /**
     * The stock to take the die. It will automatically remove the die from the other stock.
     */
    fromStock?: DiceStock<any>;

    /**
     * The element to move the die from.
     */
    fromElement?: HTMLElement;
}