interface SlotStockSettings<T> extends LineStockSettings {
    /**
     * The ids for the slots (can be number or string)
     */
    slotsIds: SlotId[];

    /**
     * The classes to apply to each slot
     */
    slotClasses?: string[];

    /**
     * How to place the die on a slot automatically
     */
    mapDieToSlot?: (die: T) => SlotId;
}

type SlotId = number | string;

interface AddDieToSlotSettings extends AddDieSettings {
    /**
     * The slot to place the die on.
     */
    slot?: SlotId;
}

/**
 * A stock with fixed slots (some can be empty)
 */
class SlotDiceStock<T> extends LineDiceStock<T> {
    protected slotsIds: SlotId[] = [];
    protected slots: HTMLDivElement[] = [];
    protected slotClasses: string[];
    protected mapDieToSlot?: (die: T) => SlotId;

    /**
     * @param manager the die manager  
     * @param element the stock element (should be an empty HTML Element)
     * @param settings a `SlotStockSettings` object
     */
    constructor(protected manager: DiceManager<T>, protected element: HTMLElement, settings: SlotStockSettings<T>) {
        super(manager, element, settings);
        element.classList.add('bga-dice_slot-stock');

        this.mapDieToSlot = settings.mapDieToSlot;
        this.slotsIds = settings.slotsIds ?? [];
        this.slotClasses = settings.slotClasses ?? [];
        this.slotsIds.forEach(slotId => {
            this.createSlot(slotId);
        });
    }

    protected createSlot(slotId: SlotId) {
        this.slots[slotId] = document.createElement("div");
        this.slots[slotId].dataset.slotId = slotId;
        this.element.appendChild(this.slots[slotId]);
        this.slots[slotId].classList.add(...['slot', ...this.slotClasses]);
    }

    /**
     * Add a die to the stock.
     *
     * @param die the die to add  
     * @param animation a `DieAnimation` object
     * @param settings a `AddDieToSlotSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    public addDie(die: T, animation?: DieAnimation, settings?: AddDieToSlotSettings): Promise<boolean> {
        const slotId = settings?.slot ?? this.mapDieToSlot?.(die);
        if (slotId === undefined) {
            throw new Error(`Impossible to add die to slot : no SlotId. Add slotId to settings or set mapDieToSlot to SlotDie constructor.`);
        }
        if (!this.slots[slotId]) {
            throw new Error(`Impossible to add die to slot "${slotId}" : slot "${slotId}" doesn't exists.`);
        }

        const newSettings = {
            ...settings,
            forceToElement: this.slots[slotId],
        };
        return super.addDie(die, animation, newSettings);
    }

    /**
     * Change the slots ids. Will empty the stock before re-creating the slots.
     * 
     * @param slotsIds the new slotsIds. Will replace the old ones.
     */
    public setSlotsIds(slotsIds: SlotId[]) {
        if (slotsIds.length == this.slotsIds.length && slotsIds.every((slotId, index) => this.slotsIds[index] === slotId)) {
            // no change
            return;
        }

        this.removeAll();
        this.element.innerHTML = '';
        this.slotsIds = slotsIds ?? [];
        this.slotsIds.forEach(slotId => {
            this.createSlot(slotId);
        });
    }

    protected canAddDie(die: T, settings?: AddDieToSlotSettings) {
        if (!this.contains(die)) {
            return true;
        } else {
            const currentDicelot = (this.getDieElement(die).closest('.slot') as HTMLDivElement).dataset.slotId;
            const slotId = settings?.slot ?? this.mapDieToSlot?.(die);
            return currentDicelot != slotId;
        }
    }

    /**
     * Swap dice inside the slot stock.
     * 
     * @param dice the dice to swap
     * @param settings for `updateInformations` and `selectable`
     */
    public swapDice(dice: T[], settings?: AddDieSettings) {
        const elements = dice.map(die => this.manager.getDieElement(die));

        dice.forEach((die, index) => {
            const dieElement = elements[index];

            const dieIndex = this.dice.findIndex(c => this.manager.getId(c) == this.manager.getId(die));
            if (dieIndex !== -1) {
                this.dice.splice(dieIndex, 1, die);
            }
    
            this.manager.updateDieInformations(die);

            this.removeSelectionClassesFromElement(dieElement);
        });

        const promise = this.manager.animationManager.swap(elements);

        dice.forEach((die, index) => {
            promise.then(() => {
                //this.manager.animationManager.base.attachToElement(dieElement, this.slots[slotId]);
                this.setSelectableDie(die, settings?.selectable ?? true);
            });
        });

        return promise;
    }
}