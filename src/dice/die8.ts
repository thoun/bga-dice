class BgaDie8 implements BgaDieType {
    public facesCount: number = 8;

    /**
     * Allow to populate the main div of the die. You can set classes or dataset, if it's informations shared by all faces.
     * 
     * @param die the die informations
     * @param element the die main Div element
     */
    setupDieDiv(die: BgaDie, element: HTMLDivElement): void {
        element.classList.add('bga-dice_die8');
    }
}