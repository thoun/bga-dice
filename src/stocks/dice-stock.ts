interface DieStockSettings {
    /**
     * Indicate the die sorting (unset means no sorting, new dice will be added at the end).
     * For example, use `sort: sortFunction('type', '-type_arg')` to sort by type then type_arg (in reversed order if prefixed with `-`). 
     * Be sure you typed the values correctly! Else '11' will be before '2'.
     */
    sort?: SortFunction;

    /**
     * Perspective effect on Stock elements. Default 1000px. Can be overriden on each stock.
     */
    perspective?: number | null;

    /**
     * The class to apply to selectable dice. Use class from manager is unset.
     */
    selectableDieClass?: string | null;

    /**
     * The class to apply to selectable dice. Use class from manager is unset.
     */
    unselectableDieClass?: string | null;

    /**
     * The class to apply to selected dice. Use class from manager is unset.
     */
    selectedDieClass?: string | null;
}

interface AddDieSettings {
    forceToElement?: HTMLElement;

    /**
     * Force die position. Default to end of list. Do not use if sort is defined, as it will override it.
     */
    index?: number;
    
    /**
     * Set if the card is selectable. Default is true, but will be ignored if the stock is not selectable.
     */
    selectable?: boolean;

    /**
     * Indicates if we add a fade in effect when adding card (if it comes from an invisible or abstract element).
     */
    fadeIn?: boolean;
}
interface RollDieSettings {    
    /**
     * Set the dice roll effect. Default 'rollIn';
     */
    effect?: DiceRollEffect;

    /**
     * Duration. A number (if fixed), or an array of 2, and it will be a random value between the 2 values.
     * Default 1000.
     */
    duration: number | number[];
}

type DiceSelectionMode = 'none' | 'single' | 'multiple';
type DiceRollEffect = 'rollIn' | 'rollInBump' | 'rollOutPauseAndBack' | 'rollOutBumpPauseAndBack' | 'turn' | 'none';

/**
 * The abstract stock. It shouldn't be used directly, use stocks that extends it.
 */
class DiceStock<T> {
    protected dice: T[] = [];
    protected selectedDice: T[] = [];
    protected selectionMode: DiceSelectionMode = 'none';
    protected sort?: SortFunction; 

    /**
     * Called when selection change. Returns the selection.
     * 
     * selection: the selected dice of the stock  
     * lastChange: the last change on selection die (can be selected or unselected)
     */
    public onSelectionChange?: (selection: T[], lastChange: T | null) => void;

    /**
     * Called when selection change. Returns the clicked die.
     * 
     * die: the clicked die (can be selected or unselected)
     */
    public onDieClick?: (die: T) => void;

    /**
     * @param manager the die manager  
     * @param element the stock element (should be an empty HTML Element)
     */
    constructor(protected manager: DiceManager<T>, protected element: HTMLElement, private settings?: DieStockSettings) {
        manager.addStock(this);
        element?.classList.add('bga-dice_die-stock'/*, this.constructor.name.split(/(?=[A-Z])/).join('-').toLowerCase()* doesn't work in production because of minification */);
        const perspective = this.getPerspective();
        element.style.setProperty('--perspective', perspective ? `${perspective}px` : 'unset');
        this.bindClick();

        this.sort = settings?.sort;
    }

    /**
     * @returns the dice on the stock
     */
    public getDice(): T[] {
        return this.dice.slice();
    }

    /**
     * @returns if the stock is empty
     */
    public isEmpty(): boolean {
        return !this.dice.length;
    }

    /**
     * @returns the selected dice
     */
    public getSelection(): T[] {
        return this.selectedDice.slice();
    }

    /**
     * @returns the selected dice
     */
    public isSelected(die: T): boolean {
        return this.selectedDice.some(c => this.manager.getId(c) == this.manager.getId(die));
    }

    /**
     * @param die a die  
     * @returns if the die is present in the stock
     */
    public contains(die: T): boolean {
        return this.dice.some(c => this.manager.getId(c) == this.manager.getId(die));
    }

    /**
     * @param die a die in the stock
     * @returns the HTML element generated for the die
     */
    public getDieElement(die: T): HTMLElement {
        return this.manager.getDieElement(die);
    }

    /**
     * Checks if the die can be added. By default, only if it isn't already present in the stock.
     * 
     * @param die the die to add
     * @param settings the addDie settings
     * @returns if the die can be added
     */
    protected canAddDie(die: T, settings?: AddDieSettings) {
        return !this.contains(die);
    }

    /**
     * Add a die to the stock.
     * 
     * @param die the die to add  
     * @param animation a `DieAnimation` object
     * @param settings a `AddDiceettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    public addDie(die: T, animation?: DieAnimationSettings, settings?: AddDieSettings): Promise<boolean> {
        if (!this.canAddDie(die, settings)) {
            return Promise.resolve(false);
        }

        // we check if die is in a stock
        let dieElement = this.getDieElement(die);
        const originStock = this.manager.getDieStock(die);

        if (dieElement && !originStock) {
            throw new Error('The die element exists but is not attached to any Stock');
        }
        if (dieElement) { // unselect the die
            originStock.unselectDie(die);
            this.removeSelectionClassesFromElement(dieElement);
        }
        const animationSettings: DieAnimationSettings = animation ?? {};
        if (originStock) { // if the die is in a Stock, the animation must come from it
            animationSettings.fromStock = originStock;
        }

        const addDieSettings: AddDieSettings = settings ?? {};
        const index = this.getNewDieIndex(die);
        if (index !== undefined) {
            addDieSettings.index = index;
        }

        if (addDieSettings.index !== null && addDieSettings.index !== undefined) {
            this.dice.splice(index, 0, die);
        } else {
            this.dice.push(die);
        }

        let promise: Promise<boolean> = dieElement ? 
            this.addExistingDieElement(die, dieElement, animationSettings, addDieSettings) : 
            this.addUnexistingDieElement(die, animationSettings, addDieSettings);

        this.manager.updateDieInformations(die);

        // if the die was from a stock, we remove the die from it. 
        // Must be called after the animation is started, so it doesn't delete the element
        if (animationSettings.fromStock && animationSettings.fromStock != this) {
            animationSettings.fromStock.removeDie(die);
        }

        if (this.selectionMode !== 'none') {
            // make selectable only at the end of the animation
            promise.then(() => this.setSelectableDie(die, addDieSettings.selectable ?? true));
        }

        return promise;
    }

    protected addExistingDieElement(die: T, dieElement: HTMLElement, animation: DieAnimationSettings, settings?: AddDieSettings): Promise<boolean> {
        const toElement = settings?.forceToElement ?? this.element;

        let insertBefore = undefined;
        if (settings?.index === null || settings?.index === undefined || !toElement.children.length || settings?.index >= toElement.children.length) {
        } else {
            insertBefore = toElement.children[settings.index];
        }

        const promise = this.animationFromElement(die, dieElement, animation.fromStock?.element ?? animation.fromElement, toElement, insertBefore, animation, settings);

        return promise;
    }

    protected addUnexistingDieElement(die: T, animation: DieAnimationSettings, settings?: AddDieSettings): Promise<boolean> {
        const dieElement = this.manager.createDieElement(die);
        return this.addExistingDieElement(die, dieElement, animation, settings);
    }

    /**
     * @param element The element to animate. The element is added to the destination stock before the animation starts. 
     * @param toElement The HTMLElement to attach the die to.
     */
    protected async animationFromElement(die: T, element: HTMLElement, fromElement: HTMLElement | null | undefined, toElement: HTMLElement, insertBefore: HTMLElement | null | undefined, animation: DieAnimationSettings, settings: AddDieSettings): Promise<boolean> {
        if (document.contains(element)) {
            const result = await this.manager.animationManager.slideAndAttach(element, toElement, animation, insertBefore);
            return result?.played ?? false;
        } else {
            this.manager.animationManager.base.attachToElement(element, toElement, insertBefore);
            let result = null;
            if (!animation.fromStock || settings.fadeIn) {
                result = await this.manager.animationManager.fadeIn(element, fromElement, animation);
            } else {
                result = await this.manager.animationManager.slideIn(element, fromElement, animation);
            }            

            return result?.played ?? false;
        }
    }

    protected getNewDieIndex(die: T): number | undefined {
        if (this.sort) {
            const otherDice = this.getDice();
            for (let i = 0; i<otherDice.length; i++) {
                const otherDie = otherDice[i];

                if (this.sort(die, otherDie) < 0) {
                    return i;
                }
            }
            return otherDice.length;
        } else {
            return undefined;
        }
    }

    protected addDieElementToParent(dieElement: HTMLElement, settings?: AddDieSettings) {
        const parent = settings?.forceToElement ?? this.element;

        if (settings?.index === null || settings?.index === undefined || !parent.children.length || settings?.index >= parent.children.length) {
            parent.appendChild(dieElement);
        } else {
            parent.insertBefore(dieElement, parent.children[settings.index]);
        }
    }

    /**
     * Add an array of dice to the stock.
     * 
     * @param dice the dice to add
     * @param animation a `DieAnimation` object
     * @param settings a `AddDiceettings` object
     * @param shift if number, the number of milliseconds between each die. if true, chain animations
     */
    public async addDice(dice: T[], animation?: DieAnimationSettings, settings?: AddDieSettings, shift: number | boolean = false): Promise<boolean> {
        if (!this.manager.game.bgaAnimationsActive()) {
            shift = false;
        }
        let promises: Promise<boolean>[] = [];

        if (shift === true) {
            if (dice.length) {
                const result = await this.addDie(dice[0], animation, settings);
                const others = await this.addDice(dice.slice(1), animation, settings, shift);
                return result || others;
            }
        } else if (typeof shift === 'number') {
            for (let i=0; i<dice.length; i++) {
                setTimeout(() => promises.push(this.addDie(dice[i], animation, settings)), i * shift);
            }
        } else {
            promises = dice.map(die => this.addDie(die, animation, settings));
        }

        const results = await Promise.all(promises);
        return results.some(result => result);
    }

    /**
     * Remove a die from the stock.
     * 
     * @param die die die to remove
     */
    public removeDie(die: T) {
        if (this.contains(die) && this.element.contains(this.getDieElement(die))) {
            this.manager.removeDie(die);
        }
        this.dieRemoved(die);
    }

    /**
     * Notify the stock that a die is removed.
     * 
     * @param die the die to remove
     */
    public dieRemoved(die: T) {
        const index = this.dice.findIndex(c => this.manager.getId(c) == this.manager.getId(die));
        if (index !== -1) {
            this.dice.splice(index, 1);
        }
        if (this.selectedDice.find(c => this.manager.getId(c) == this.manager.getId(die))) {
            this.unselectDie(die);
        }
    }

    /**
     * Remove a set of dice from the stock.
     * 
     * @param dice the dice to remove
     */
    public removeDice(dice: T[]) {
        dice.forEach(die => this.removeDie(die));
    }

    /**
     * Remove all dice from the stock.
     */
    public removeAll() {
        const dice = this.getDice(); // use a copy of the array as we iterate and modify it at the same time
        dice.forEach(die => this.removeDie(die));
    }

    /**
     * Set if the stock is selectable, and if yes if it can be multiple.
     * If set to 'none', it will unselect all selected dice.
     * 
     * @param selectionMode the selection mode
     * @param selectableDice the selectable dice (all if unset). Calls `setSelectableDice` method
     */
    public setSelectionMode(selectionMode: DiceSelectionMode, selectableDice?: T[]) {
        if (selectionMode !== this.selectionMode) {
            this.unselectAll(true);
        }

        this.dice.forEach(die => this.setSelectableDie(die, selectionMode != 'none'));
        this.element.classList.toggle('bga-dice_selectable-stock', selectionMode != 'none');
        this.selectionMode = selectionMode;
        
        if (selectionMode === 'none') {
            this.getDice().forEach(die => this.removeSelectionClasses(die));
        } else {
            this.setSelectableDice(selectableDice ?? this.getDice());
        }
    }

    protected setSelectableDie(die: T, selectable: boolean) {
        if (this.selectionMode === 'none') {
            return;
        }

        const element = this.getDieElement(die);              
        const selectableDiceClass = this.getSelectableDieClass();
        const unselectableDiceClass = this.getUnselectableDieClass();

        if (selectableDiceClass) {
            element.classList.toggle(selectableDiceClass, selectable);
        }
        if (unselectableDiceClass) {
            element.classList.toggle(unselectableDiceClass, !selectable);
        }

        if (!selectable && this.isSelected(die)) {
            this.unselectDie(die, true);
        }
    }

    /**
     * Set the selectable class for each die.
     * 
     * @param selectableDice the selectable dice. If unset, all dice are marked selectable. Default unset.
     */
    public setSelectableDice(selectableDice?: T[]) {
        if (this.selectionMode === 'none') {
            return;
        }

        const selectableDiceIds = (selectableDice ?? this.getDice()).map(die => this.manager.getId(die));

        this.dice.forEach(die =>
            this.setSelectableDie(die, selectableDiceIds.includes(this.manager.getId(die)))
        );
    }

    /**
     * Set selected state to a die.
     * 
     * @param die the die to select
     */
    public selectDie(die: T, silent: boolean = false) {
        if (this.selectionMode == 'none') {
            return;
        }

        const element = this.getDieElement(die);

        const selectableDiceClass = this.getSelectableDieClass();
        if (!element.classList.contains(selectableDiceClass)) {
            return;
        }
        
        if (this.selectionMode === 'single') {
            this.dice.filter(c => this.manager.getId(c) != this.manager.getId(die)).forEach(c => this.unselectDie(c, true));
        }

        const selectedDiceClass = this.getSelectedDieClass();
        element.classList.add(selectedDiceClass);
        this.selectedDice.push(die);
        
        if (!silent) {
            this.onSelectionChange?.(this.selectedDice.slice(), die);
        }
    }

    /**
     * Set unselected state to a die.
     * 
     * @param die the die to unselect
     */
    public unselectDie(die: T, silent: boolean = false) {
        const element = this.getDieElement(die);      
        const selectedDiceClass = this.getSelectedDieClass();
        element.classList.remove(selectedDiceClass);

        const index = this.selectedDice.findIndex(c => this.manager.getId(c) == this.manager.getId(die));
        if (index !== -1) {
            this.selectedDice.splice(index, 1);
        }
        
        if (!silent) {
            this.onSelectionChange?.(this.selectedDice.slice(), die);
        }
    }

    /**
     * Select all dice
     */
    public selectAll(silent: boolean = false) {
        if (this.selectionMode == 'none') {
            return;
        }

        this.dice.forEach(c => this.selectDie(c, true));
        
        if (!silent) {
            this.onSelectionChange?.(this.selectedDice.slice(), null);
        }
    }

    /**
     * Unelect all dice
     */
    public unselectAll(silent: boolean = false) {
        const dice = this.getDice(); // use a copy of the array as we iterate and modify it at the same time
        dice.forEach(c => this.unselectDie(c, true));
        
        if (!silent) {
            this.onSelectionChange?.(this.selectedDice.slice(), null);
        }
    }

    protected bindClick() {
        this.element?.addEventListener('click', event => {
            const dieDiv = (event.target as HTMLElement).closest('.bga-dice_die');
            if (!dieDiv) {
                return;
            }
            const die = this.dice.find(c => this.manager.getDieElementId(c) == dieDiv.id);
            if (!die) {
                return;
            }
            this.dieClick(die);
        });
    }

    protected dieClick(die: T) {
        if (this.selectionMode != 'none') {
            const alreadySelected = this.selectedDice.some(c => this.manager.getId(c) == this.manager.getId(die));

            if (alreadySelected) {
                this.unselectDie(die);
            } else {
                this.selectDie(die);
            }
        }

        this.onDieClick?.(die);
    }

    /**
     * @returns the perspective for this stock.
     */
    private getPerspective(): number | null {
        return this.settings?.perspective === undefined ? this.manager.getPerspective() : this.settings?.perspective;
    }

    /**
     * @returns the class to apply to selectable dice. Use class from manager is unset.
     */
    public getSelectableDieClass(): string | null {
        return this.settings?.selectableDieClass === undefined ? this.manager.getSelectableDieClass() : this.settings?.selectableDieClass;
    }

    /**
     * @returns the class to apply to selectable dice. Use class from manager is unset.
     */
    public getUnselectableDieClass(): string | null {
        return this.settings?.unselectableDieClass === undefined ?this.manager.getUnselectableDieClass() : this.settings?.unselectableDieClass;
    }

    /**
     * @returns the class to apply to selected dice. Use class from manager is unset.
     */
    public getSelectedDieClass(): string | null {
        return this.settings?.selectedDieClass === undefined ? this.manager.getSelectedDieClass() : this.settings?.selectedDieClass;
    }

    public removeSelectionClasses(die: T) {        
        this.removeSelectionClassesFromElement(this.getDieElement(die));
    }

    public removeSelectionClassesFromElement(dieElement: HTMLElement) {        
        const selectableDiceClass = this.getSelectableDieClass();
        const unselectableDiceClass = this.getUnselectableDieClass();
        const selectedDiceClass = this.getSelectedDieClass();

        dieElement.classList.remove(selectableDiceClass, unselectableDiceClass, selectedDiceClass);
    }

    protected getRand(min: number, max: number): number {
        return Math.floor(Math.random() * ((max + 1) - min) + min);
    }

    protected async getRollAnimation(element: Element, duration: number, deltaYFrom: number = 0, deltaYTo: number = 0, moveHorizontally: boolean = true) {
        const size = this.manager.getSize();
        const distance = deltaYTo - deltaYFrom;
        const horizontalMargin = () => moveHorizontally ? this.getRand(-size / 4, size / 4) : 0;
        await element.animate([
            { transform: `translate(${horizontalMargin()}px, ${deltaYFrom}px) translateZ(${size * 4}px)`},
            { transform: `translate(${horizontalMargin()}px, ${deltaYFrom + distance * 0.2}px)`},
            { transform: `translate(${horizontalMargin()}px, ${deltaYFrom + distance * 0.4}px) translateZ(${size * 3}px)`},
            { transform: `translate(${horizontalMargin()}px, ${deltaYFrom + distance * 0.6}px)`},
            { transform: `translate(${horizontalMargin()}px, ${deltaYFrom + distance * 0.8}px) translateZ(${size * 2}px)`},
            { transform: `translate(0px, ${deltaYTo}px)` },
        ], duration).finished;
    }

    protected async addRollEffectToDieElement(die: T, element: HTMLElement, effect: DiceRollEffect, duration: number) {
        const size = this.manager.getSize();
        switch (effect) {
            case 'rollIn':
                await this.getRollAnimation(element, duration, -size * 5, 0);
                break;
            case 'rollOutPauseAndBack':
                await this.getRollAnimation(element, duration, 0, size * 5);
                await element.animate([
                    { transform: `translate(0px, ${size * 5}px)`},
                    { transform: `translate(0px, ${size * 5}px)`},
                ], duration / 3).finished;
                await element.animate([
                    { transform: `translate(0px, ${size * 5}px)`},
                    { transform: `translate(0px, 0px)` },
                ], duration / 3).finished;
                break;
            case 'turn':
                await this.manager.game.wait(duration);
                break;
        }
    }

    public rollDice(dice: T[], settings?: RollDieSettings) {
        dice.forEach(die => this.rollDie(die, settings));
    }

    public async rollDie(die: T, settings?: RollDieSettings) {
        const div = this.getDieElement(die);
        const faces = div.querySelector('.bga-dice_die-faces') as HTMLElement;

        faces.dataset.visibleFace = `${this.manager.getDieFace(die)}`;

        const rollEffect = settings?.effect ?? 'rollIn';
        const animate = this.manager.game.bgaAnimationsActive() && rollEffect !== 'none';
        if (animate) {
            let duration = settings?.duration ?? 1000;
            if (Array.isArray(duration)) {
                duration = this.getRand(duration[0], duration[1]);
            }

            const getRandDeg = () => this.getRand(360, 540);

            await Promise.all([
                // dice movement animation (slide with bumps)
                this.addRollEffectToDieElement(die, div, rollEffect, duration),

                // dice roll animation (roll on itself)
                faces.animate([
                    { transform: `rotateX(${getRandDeg()}deg) rotateY(${getRandDeg()}deg) rotateZ(${getRandDeg()}deg)`},
                    { transform: `` },
                ], duration).finished,
            ]);
        }
    }
}
