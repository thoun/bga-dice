import { DieAnimationSettings } from "../animations";
import { DiceManager } from "../dice-manager";
import { DiceStock, DieStockSettings, AddDieSettings } from "./dice-stock";

/**
 * A stock with manually placed dice
 */
export class ManualPositionStock<T> extends DiceStock<T> {

    /**
     * @param manager the die manager  
     * @param element the stock element (should be an empty HTML Element)
     */
    constructor(protected manager: DiceManager<T>, protected element: HTMLElement, settings: DieStockSettings<T>, protected updateDisplay: (element: HTMLElement, dice: T[], lastDie: T, stock: ManualPositionStock<T>) => any) {
        super(manager, element, settings);
        element.classList.add('bga-dice_manual-position-stock');
    }

    /**
     * Add a die to the stock.
     *
     * @param die the die to add  
     * @param animation a `DieAnimationSettings` object
     * @param settings a `AddDiceettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    public addDie(die: T, animation?: DieAnimationSettings, settings?: AddDieSettings): Promise<boolean> {
        const promise = super.addDie(die, animation, settings);
        this.updateDisplay(this.element, this.getDice(), die, this);
        return promise;
    }

    public dieRemoved(die: T) {
        super.dieRemoved(die);
        this.updateDisplay(this.element, this.getDice(), die, this);
    }
}