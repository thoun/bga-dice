import { DiceStock } from "./stocks/dice-stock";

type AnimationManager = any;

export interface DiceManagerSettings<T> {
    /**
     * The type of dice, if you game has multiple dice types (each dice manager should have a different type).
     * Default `${yourgamename}-dice`.
     * 
     * The die element will have this type as a class, and each face will have the class `${type}-face-${number}`.
     */
    type?: string;

    /**
     * The number of faces of the die (default 6).
     */
    faces?: number;

    /**
     * The size of the die, in px (default 50).
     */
    size?: number;

    /**
     * The border radius, in % (default 0).
     */
    borderRadius?: number;

    /**
     * Define the id that will be set to each die div. It must return a unique id for each different die, so it's often linked to die id.
     * 
     * Default: the id will be set to `die.id`.
     * 
     * @param die the die informations
     * @return the id for a die
     */
    getId?: (die: T) => string | number;

    /**
     * Allow to populate the main div of the die. You can set classes or dataset, if it's informations shared by all faces.
     * 
     * @param die the die informations
     * @param element the die main Div element
     */
    setupDieDiv?: (die: T, element: HTMLDivElement) => void;

    /**
     * Allow to populate a face div of the die. You can set classes or dataset to show the correct die face.
     * 
     * @param die the die informations
     * @param element the die face Div element
     * @param face the face number (1-indexed)
     */
    setupFaceDiv?: (die: T, element: HTMLDivElement, face: number) => void;

    /** 
     * Return the die face.
     * Default: the face will be set to `die.face`.
     * 
     * @param die the die informations
     * @return the die face
     */
    getDieFace?: (die: T) => number;

    /**
     * The animation manager used in the game.
     */
    animationManager: AnimationManager;

    /**
     * Perspective effect on Stock elements. Default 1000px. Can be overriden on each stock.
     */
    perspective?: number | null;

    /**
     * The class to apply to selectable dice. Default 'bga-dice_selectable-die'.
     */
    selectableDieClass?: string | null;

    /**
     * The class to apply to selectable dice. Default 'bga-dice_disabled-die'.
     */
    unselectableDieClass?: string | null;

    /**
     * The class to apply to selected dice. Default 'bga-dice_selected-die'.
     */
    selectedDieClass?: string | null;
}

export class DiceManager<T> {
    public animationManager: AnimationManager;

    private stocks: DiceStock<T>[] = [];

    /**
     * @param settings: a `DieManagerSettings` object
     */
    constructor(private settings: DiceManagerSettings<T>) {
        if (!settings || !settings.animationManager) {
            throw new Error('You must define an AnimationManager in the settings');
        }

        this.animationManager = settings.animationManager;

        if (![4, 6, 8].includes(this.getFaces())) {
            throw new Error('Unsupported settings.faces');
        }
    }

    public addStock(stock: DiceStock<T>) {
        this.stocks.push(stock);
    }

    public getFaces(): number {
        return this.settings.faces ?? 6;
    }

    public getSize(): number {
        return this.settings.size ?? 50;
    }

    public getBorderRadius(): number {
        return this.settings.borderRadius ?? 0;
    }

    /**
     * @param die the die informations
     * @return the id for a die
     */
    public getId(die: T): string | number {
        return this.settings.getId?.(die) ?? `${(die as any).id}`;
    }

    /**
     * @param card the card informations
     * @return the id for a card element
     */
    public getDieElementId(die: T): string {
        return `${this.getType()}-${this.getId(die)}`;
    }

    /**
     * 
     * @returns the type of the dice, either set in the settings or by using a default name if there is only 1 type.
     */
    public getType(): string {
        return this.settings.type ?? `game-dice`;
    }

    /** 
     * Return the die face.
     * Default: the face will be set to `die.face`.
     * 
     * @param die the die informations
     * @return the die face
     */
    public getDieFace(die: T): number {
        return this.settings.getDieFace?.(die) ?? (die as any).face;
    }

    public createDieElement(die: T): HTMLDivElement {
        const id = this.getDieElementId(die);

        if (this.getDieElement(die)) {
            throw new Error(`This die already exists ${JSON.stringify(die)}`);
        }

        const faces = this.getFaces();
        const type = this.getType();

        const element = document.createElement("div");
        element.id = id;
        element.classList.add('bga-dice_die', `bga-dice_die${faces}`, type);
        element.style.setProperty('--size', `${this.getSize()}px`);
        element.style.setProperty('--bga-dice_border-radius', `${this.getBorderRadius()}%`);
        
        const dieFaces = document.createElement("div");
        dieFaces.classList.add('bga-dice_die-faces');
        dieFaces.dataset.visibleFace = ''+this.getDieFace(die);
        element.appendChild(dieFaces);
        
        const facesElements = [];

        for (let i = 1; i <= faces; i++) {            
            facesElements[i] = document.createElement("div");
            facesElements[i].id = `${id}-face-${i}`;
            facesElements[i].classList.add('bga-dice_die-face', `${type}-face-${i}`);
            facesElements[i].dataset.face = ''+i;
            dieFaces.appendChild(facesElements[i]);
        }
        

        document.body.appendChild(element);
        this.settings.setupDieDiv?.(die, element);
        if (this.settings.setupFaceDiv) {
            for (let i = 1; i <= faces; i++) {            
                this.settings.setupFaceDiv(die, facesElements[i], i);
            }
        }
        document.body.removeChild(element);
        return element;
    }

    /**
     * @param die the die informations
     * @return the HTML element of an existing die
     */
    public getDieElement(die: T): HTMLElement {
        return document.getElementById(this.getDieElementId(die));
    }

    /**
     * Remove a die.
     * 
     * @param die the die to remove
     */
    public removeDie(die: T) {
        const div = this.getDieElement(die);
        if (!div) {
            return false;
        }

        div.id = `deleted-${div.id}`;
        div.remove();

        // if the die is in a stock, notify the stock about removal
        this.getDieStock(die)?.dieRemoved(die);

        return true;
    }

    /**
     * Returns the stock containing the die.
     * 
     * @param die the die informations
     * @return the stock containing the die
     */
    public getDieStock(die: T): DiceStock<T> {
        return this.stocks.find(stock => stock.contains(die));
    }

    /**
     * Update the die informations. Used when a change visible face.
     * 
     * @param die the die informations
     */
    public updateDieInformations(die: T, updateData?: boolean): void {
        const div = this.getDieElement(die);
        (div.querySelector('.bga-dice_die-faces') as HTMLDivElement).dataset.visibleFace = ''+this.getDieFace(die);

        if (updateData ?? true) {
            // die data has changed
            const stock = this.getDieStock(die);
            const dice = stock.getDice();
            const dieIndex = dice.findIndex(c => this.getId(c) === this.getId(die));
            if (dieIndex !== -1) {
                (stock as any).dice.splice(dieIndex, 1, die);
            }
        }
    }

    /**
     * @returns the default perspective for all stocks.
     */
    public getPerspective(): number | null {
        return this.settings?.perspective === undefined ? 1000 : this.settings?.perspective;
    }

    /**
     * @returns the class to apply to selectable dice. Default 'bga-dice_selectable-die'.
     */
    public getSelectableDieClass(): string | null {
        return this.settings?.selectableDieClass === undefined ? 'bga-dice_selectable-die' : this.settings?.selectableDieClass;
    }

    /**
     * @returns the class to apply to selectable dice. Default 'bga-dice_disabled-die'.
     */
    public getUnselectableDieClass(): string | null {
        return this.settings?.unselectableDieClass === undefined ? 'bga-dice_disabled-die' : this.settings?.unselectableDieClass;
    }

    /**
     * @returns the class to apply to selected dice. Default 'bga-dice_selected-die'.
     */
    public getSelectedDieClass(): string | null {
        return this.settings?.selectedDieClass === undefined ? 'bga-dice_selected-die' : this.settings?.selectedDieClass;
    }
}