class Die6 implements DieType {
    public facesCount: number = 6;

    /**
     * 
     * @param borderRadius the border radius, in %
     */
    constructor(protected borderRadius: number = 0) {
    }

    /**
     * Allow to populate the main div of the die. You can set classes or dataset, if it's informations shared by all faces.
     * 
     * @param die the die informations
     * @param element the die main Div element
     */
    setupDieDiv(die: Die, element: HTMLDivElement): void {
        element.classList.add('bga-dice_die6');
        element.style.setProperty('--bga-dice_border-radius', `${this.borderRadius}%`)
    }
}