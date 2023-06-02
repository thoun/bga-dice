interface BgaDie4Settings {
    /**
     * 
     */
    showValueOverlay?: boolean;
}

class BgaDie4 implements BgaDieType {
    public facesCount: number = 4;
    protected showValueOverlay: boolean;

    /**
     * Create the die type.
     * 
     * @param settings the die settings
     */
    constructor(protected settings?: BgaDie4Settings) {
        this.showValueOverlay = settings?.showValueOverlay ?? false;
    }

    /**
     * Allow to populate the main div of the die. You can set classes or dataset, if it's informations shared by all faces.
     * 
     * @param die the die informations
     * @param element the die main Div element
     */
    setupDieDiv(die: BgaDie, element: HTMLDivElement): void {
        element.classList.add('bga-dice_die4');
    }
}