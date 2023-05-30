interface BgaAnimationSettings {
    /**
     * The element to animate.
     */
    element?: HTMLElement;
    /**
     * The game class. Used to know if the game is in instantaneous mode (replay) becausewe don't want animations in this case.
     */
    game?: Game;
    /**
     * The animation duration, in ms (default: 500).
     */
    duration?: number;
    /**
     * The cumulated scale of the element to animate (default: 1).
     */
    scale?: number;
    /**
     * The class to add to the animated element.
     */
    animationClass?: string;
    /**
     * A function called when animation starts (for example to add a zoom effect on a card during a reveal animation).
     */
    animationStart?: (animation: IBgaAnimation<BgaAnimationSettings>) => any;
    /**
     * A function called when animation ends.
     */
    animationEnd?: (animation: IBgaAnimation<BgaAnimationSettings>) => any;
}
interface BgaElementAnimationSettings extends BgaAnimationSettings {
    /**
     * The element to animate.
     */
    element: HTMLElement;
    /**
     * The zIndex to apply during animation (default: 10).
     */
    zIndex?: number;
    /**
     * The transform property to set after the animation.
     */
    finalTransform?: string;
    /**
     * If the card is rotated at the start of animation.
     */
    rotationDelta?: number;
}
interface BgaAnimationWithOriginSettings extends BgaElementAnimationSettings {
    /**
     * A delta coordinates (object with x and y properties).
     */
    fromDelta?: {
        x: number;
        y: number;
    };
    /**
     * An initial Rect position. Can be the moved object BoundingClientRect itself, before being attached.
     */
    fromRect?: DOMRect;
    /**
     * The element to move the card from.
     */
    fromElement?: HTMLElement;
}
interface IBgaAnimation<T extends BgaAnimationSettings> {
    settings: T;
    played: boolean | null;
    result: any | null;
    playWhenNoAnimation: boolean;
}
/**
 * Animation function signature. Will return a promise after animation is ended. The promise returns the result of the animation, if any
 */
type BgaAnimationFunction = (animationManager: AnimationManager, animation: IBgaAnimation<BgaAnimationSettings>) => Promise<any>;
declare class BgaAnimation<T extends BgaAnimationSettings> implements IBgaAnimation<BgaAnimationSettings> {
    animationFunction: BgaAnimationFunction;
    settings: T;
    played: boolean | null;
    result: any | null;
    playWhenNoAnimation: boolean;
    constructor(animationFunction: BgaAnimationFunction, settings: T);
}
interface BgaAttachWithAnimationSettings extends BgaElementAnimationSettings {
    animation: BgaAnimation<BgaAnimationWithOriginSettings>;
    /**
     * The target to attach the element to.
     */
    attachElement: HTMLElement;
    /**
     * A function called after attaching the element.
     */
    afterAttach?: (element: HTMLElement, attachElement: HTMLElement) => void;
}
/**
 * Just use playSequence from animationManager
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
declare function attachWithAnimation(animationManager: AnimationManager, animation: IBgaAnimation<BgaAttachWithAnimationSettings>): Promise<any>;
declare class BgaAttachWithAnimation<BgaAnimationWithAttachAndOriginSettings> extends BgaAnimation<any> {
    constructor(settings: BgaAnimationWithAttachAndOriginSettings);
}
interface BgaCumulatedAnimationsSettings extends BgaAnimationSettings {
    animations: IBgaAnimation<BgaAnimationSettings>[];
}
/**
 * Just use playSequence from animationManager
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
declare function cumulatedAnimations(animationManager: AnimationManager, animation: IBgaAnimation<BgaCumulatedAnimationsSettings>): Promise<any>;
declare class BgaCumulatedAnimation<BgaCumulatedAnimationsSettings> extends BgaAnimation<any> {
    constructor(settings: BgaCumulatedAnimationsSettings);
}
/**
 * Linear slide of the element from origin to destination.
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
declare function slideAnimation(animationManager: AnimationManager, animation: IBgaAnimation<BgaElementAnimationSettings>): Promise<void>;
declare class BgaSlideAnimation<BgaAnimationWithAttachAndOriginSettings> extends BgaAnimation<any> {
    constructor(settings: BgaAnimationWithAttachAndOriginSettings);
}
/**
 * Linear slide of the element from origin to destination.
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
declare function slideToAnimation(animationManager: AnimationManager, animation: IBgaAnimation<BgaElementAnimationSettings>): Promise<void>;
declare class BgaSlideToAnimation<BgaAnimationWithAttachAndOriginSettings> extends BgaAnimation<any> {
    constructor(settings: BgaAnimationWithAttachAndOriginSettings);
}
declare function shouldAnimate(settings?: BgaAnimationSettings): boolean;
/**
 * Return the x and y delta, based on the animation settings;
 *
 * @param settings an `AnimationSettings` object
 * @returns a promise when animation ends
 */
declare function getDeltaCoordinates(element: HTMLElement, settings: BgaAnimationWithOriginSettings): {
    x: number;
    y: number;
};
declare function logAnimation(animationManager: AnimationManager, animation: IBgaAnimation<BgaCumulatedAnimationsSettings>): Promise<any>;
interface IZoomManager {
    /**
     * Returns the zoom level
     */
    zoom: number;
}
interface AnimationManagerSettings {
    /**
     * The default animation duration, in ms (default: 500).
     */
    duration?: number;
    /**
     * The zoom manager, providing the current scale.
     */
    zoomManager?: IZoomManager;
}
declare class AnimationManager {
    game: Game;
    private settings?;
    /**
     * The zoom manager, providing the current scale.
     */
    private zoomManager?;
    /**
     * @param game the BGA game class, usually it will be `this`
     * @param settings: a `AnimationManagerSettings` object
     */
    constructor(game: Game, settings?: AnimationManagerSettings);
    getZoomManager(): IZoomManager;
    /**
     * Set the zoom manager, to get the scale of the current game.
     *
     * @param zoomManager the zoom manager
     */
    setZoomManager(zoomManager: IZoomManager): void;
    getSettings(): AnimationManagerSettings | null | undefined;
    /**
     * Returns if the animations are active. Animation aren't active when the window is not visible (`document.visibilityState === 'hidden'`), or `game.instantaneousMode` is true.
     *
     * @returns if the animations are active.
     */
    animationsActive(): boolean;
    /**
     * Plays an animation if the animations are active. Animation aren't active when the window is not visible (`document.visibilityState === 'hidden'`), or `game.instantaneousMode` is true.
     *
     * @param animation the animation to play
     * @returns the animation promise.
     */
    play(animation: BgaAnimation<BgaAnimationSettings>): Promise<BgaAnimation<BgaAnimationSettings>>;
    /**
     * Plays multiple animations in parallel.
     *
     * @param animations the animations to play
     * @returns a promise for all animations.
     */
    playParallel(animations: BgaAnimation<BgaAnimationSettings>[]): Promise<BgaAnimation<BgaAnimationSettings>[]>;
    /**
     * Plays multiple animations in sequence (the second when the first ends, ...).
     *
     * @param animations the animations to play
     * @returns a promise for all animations.
     */
    playSequence(animations: BgaAnimation<BgaAnimationSettings>[]): Promise<BgaAnimation<BgaAnimationSettings>[]>;
    /**
     * Plays multiple animations with a delay between each animation start.
     *
     * @param animations the animations to play
     * @param delay the delay (in ms)
     * @returns a promise for all animations.
     */
    playWithDelay(animations: BgaAnimation<BgaAnimationSettings>[], delay: number): Promise<BgaAnimation<BgaAnimationSettings>[]>;
    /**
     * Attach an element to a parent, then play animation from element's origin to its new position.
     *
     * @param animation the animation function
     * @param attachElement the destination parent
     * @returns a promise when animation ends
     */
    attachWithAnimation(animation: BgaAnimation<BgaAnimationSettings>, attachElement: HTMLElement): Promise<BgaAnimation<any>>;
}
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
    /**
     * An animation function, that return a Promise at the end of animation (the promise returns true if animation ended, false otherwise)
     */
    animation?: BgaAnimation<BgaElementAnimationSettings>;
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
    /**
     * An animation function, that return a Promise at the end of animation (the promise returns true if animation ended, false otherwise)
     */
    animation?: BgaAnimation<BgaElementAnimationSettings>;
}
type SortFunction = (a: any, b: any) => number;
declare function sortFunction(...sortedFields: string[]): SortFunction;
interface Die {
    type: number | string;
    id: number;
    face: number;
}
interface DieType {
    facesCount: number;
    dieTypeClass: string;
    /**
     * Allow to populate the main div of the die. You can set classes or dataset, if it's informations shared by all faces.
     *
     * @param die the die informations
     * @param element the die main Div element
     */
    setupDieDiv?: (die: Die, element: HTMLDivElement) => void;
    /**
     * Allow to populate a face div of the die. You can set classes or dataset to show the correct die face.
     *
     * @param die the die informations
     * @param element the die face Div element
     * @param face the face number (1-indexed)
     */
    setupFaceDiv?: (die: Die, element: HTMLDivElement, face: number) => void;
}
declare class Die4 implements DieType {
    facesCount: number;
    dieTypeClass: string;
    constructor();
}
declare class Die6 implements DieType {
    facesCount: number;
    dieTypeClass: string;
    constructor();
}
interface DieStockSettings {
    /**
     * Indicate the die sorting (unset means no sorting, new dice will be added at the end).
     * For example, use `sort: sortFunction('type', '-type_arg')` to sort by type then type_arg (in reversed order if prefixed with `-`).
     * Be sure you typed the values correctly! Else '11' will be before '2'.
     */
    sort?: SortFunction;
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
    /**
     * If the die will be on its visible side on the stock
     */
    visible?: boolean;
    forceToElement?: HTMLElement;
    /**
     * Force die position. Default to end of list. Do not use if sort is defined, as it will override it.
     */
    index?: number;
    /**
     * If the die need to be updated. Default true, will flip the die if needed.
     */
    updateInformations?: boolean;
    /**
     * Set if the die is selectable. Default is true, but will be ignored if the stock is not selectable.
     */
    selectable?: boolean;
}
interface RemoveDieSettings {
}
type DiceelectionMode = 'none' | 'single' | 'multiple';
/**
 * The abstract stock. It shouldn't be used directly, use stocks that extends it.
 */
declare class DiceStock {
    protected manager: DiceManager;
    protected element: HTMLElement;
    private settings?;
    protected dice: Die[];
    protected selectedDice: Die[];
    protected selectionMode: DiceelectionMode;
    protected sort?: SortFunction;
    /**
     * Called when selection change. Returns the selection.
     *
     * selection: the selected dice of the stock
     * lastChange: the last change on selection die (can be selected or unselected)
     */
    onSelectionChange?: (selection: Die[], lastChange: Die | null) => void;
    /**
     * Called when selection change. Returns the clicked die.
     *
     * die: the clicked die (can be selected or unselected)
     */
    onDieClick?: (die: Die) => void;
    /**
     * @param manager the die manager
     * @param element the stock element (should be an empty HTML Element)
     */
    constructor(manager: DiceManager, element: HTMLElement, settings?: DieStockSettings);
    /**
     * @returns the dice on the stock
     */
    getDice(): Die[];
    /**
     * @returns if the stock is empty
     */
    isEmpty(): boolean;
    /**
     * @returns the selected dice
     */
    getSelection(): Die[];
    /**
     * @returns the selected dice
     */
    isSelected(die: Die): boolean;
    /**
     * @param die a die
     * @returns if the die is present in the stock
     */
    contains(die: Die): boolean;
    /**
     * @param die a die in the stock
     * @returns the HTML element generated for the die
     */
    getDieElement(die: Die): HTMLElement;
    /**
     * Checks if the die can be added. By default, only if it isn't already present in the stock.
     *
     * @param die the die to add
     * @param settings the addDie settings
     * @returns if the die can be added
     */
    protected canAddDie(die: Die, settings?: AddDieSettings): boolean;
    /**
     * Add a die to the stock.
     *
     * @param die the die to add
     * @param animation a `DieAnimation` object
     * @param settings a `AddDiceettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    addDie(die: Die, animation?: DieAnimation, settings?: AddDieSettings): Promise<boolean>;
    protected getNewDieIndex(die: Die): number | undefined;
    protected addDieElementToParent(dieElement: HTMLElement, settings?: AddDieSettings): void;
    protected moveFromOtherStock(die: Die, dieElement: HTMLElement, animation: DieAnimation, settings?: AddDieSettings): Promise<boolean>;
    protected moveFromElement(die: Die, dieElement: HTMLElement, animation: DieAnimation, settings?: AddDieSettings): Promise<boolean>;
    /**
     * Add an array of dice to the stock.
     *
     * @param dice the dice to add
     * @param animation a `DieAnimation` object
     * @param settings a `AddDiceettings` object
     * @param shift if number, the number of milliseconds between each die. if true, chain animations
     */
    addDice(dice: Die[], animation?: DieAnimation, settings?: AddDieSettings, shift?: number | boolean): Promise<boolean>;
    /**
     * Remove a die from the stock.
     *
     * @param die die die to remove
     * @param settings a `RemoveDieSettings` object
     */
    removeDie(die: Die, settings?: RemoveDieSettings): void;
    /**
     * Notify the stock that a die is removed.
     *
     * @param die the die to remove
     * @param settings a `RemoveDieSettings` object
     */
    dieRemoved(die: Die, settings?: RemoveDieSettings): void;
    /**
     * Remove a set of dice from the stock.
     *
     * @param dice the dice to remove
     * @param settings a `RemoveDieSettings` object
     */
    removeDice(dice: Die[], settings?: RemoveDieSettings): void;
    /**
     * Remove all dice from the stock.
     * @param settings a `RemoveDiceettings` object
     */
    removeAll(settings?: RemoveDieSettings): void;
    /**
     * Set if the stock is selectable, and if yes if it can be multiple.
     * If set to 'none', it will unselect all selected dice.
     *
     * @param selectionMode the selection mode
     * @param selectableDice the selectable dice (all if unset). Calls `setSelectableDice` method
     */
    setSelectionMode(selectionMode: DiceelectionMode, selectableDice?: Die[]): void;
    protected setSelectableDie(die: Die, selectable: boolean): void;
    /**
     * Set the selectable class for each die.
     *
     * @param selectableDice the selectable dice. If unset, all dice are marked selectable. Default unset.
     */
    setSelectableDice(selectableDice?: Die[]): void;
    /**
     * Set selected state to a die.
     *
     * @param die the die to select
     */
    selectDie(die: Die, silent?: boolean): void;
    /**
     * Set unselected state to a die.
     *
     * @param die the die to unselect
     */
    unselectDie(die: Die, silent?: boolean): void;
    /**
     * Select all dice
     */
    selectAll(silent?: boolean): void;
    /**
     * Unelect all dice
     */
    unselectAll(silent?: boolean): void;
    protected bindClick(): void;
    protected dieClick(die: Die): void;
    /**
     * @param element The element to animate. The element is added to the destination stock before the animation starts.
     * @param fromElement The HTMLElement to animate from.
     */
    protected animationFromElement(element: HTMLElement, fromRect: DOMRect, settings: DieAnimationSettings): Promise<boolean>;
    /**
     * @returns the class to apply to selectable dice. Use class from manager is unset.
     */
    getSelectableDieClass(): string | null;
    /**
     * @returns the class to apply to selectable dice. Use class from manager is unset.
     */
    getUnselectableDieClass(): string | null;
    /**
     * @returns the class to apply to selected dice. Use class from manager is unset.
     */
    getSelectedDieClass(): string | null;
    removeSelectionClasses(die: Die): void;
    removeSelectionClassesFromElement(dieElement: HTMLElement): void;
}
interface LineStockSettings extends DieStockSettings {
    /**
     * Indicate if the line should wrap when needed (default wrap)
     */
    wrap?: 'wrap' | 'nowrap';
    /**
     * Indicate the line direction (default row)
     */
    direction?: 'row' | 'column';
    /**
     * indicate if the line should be centered (default yes)
     */
    center?: boolean;
    /**
    * CSS to set the gap between dice. '8px' if unset.
    */
    gap?: string;
}
/**
 * A basic stock for a list of dice, based on flex.
 */
declare class LineStock extends DiceStock {
    protected manager: DiceManager;
    protected element: HTMLElement;
    /**
     * @param manager the die manager
     * @param element the stock element (should be an empty HTML Element)
     * @param settings a `LineStockSettings` object
     */
    constructor(manager: DiceManager, element: HTMLElement, settings?: LineStockSettings);
}
interface SlotStockSettings extends LineStockSettings {
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
    mapDieToSlot?: (die: Die) => SlotId;
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
declare class SlotStock extends LineStock {
    protected manager: DiceManager;
    protected element: HTMLElement;
    protected slotsIds: SlotId[];
    protected slots: HTMLDivElement[];
    protected slotClasses: string[];
    protected mapDieToSlot?: (die: Die) => SlotId;
    /**
     * @param manager the die manager
     * @param element the stock element (should be an empty HTML Element)
     * @param settings a `SlotStockSettings` object
     */
    constructor(manager: DiceManager, element: HTMLElement, settings: SlotStockSettings);
    protected createSlot(slotId: SlotId): void;
    /**
     * Add a die to the stock.
     *
     * @param die the die to add
     * @param animation a `DieAnimation` object
     * @param settings a `AddDieToSlotSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    addDie(die: Die, animation?: DieAnimation, settings?: AddDieToSlotSettings): Promise<boolean>;
    /**
     * Change the slots ids. Will empty the stock before re-creating the slots.
     *
     * @param slotsIds the new slotsIds. Will replace the old ones.
     */
    setSlotsIds(slotsIds: SlotId[]): void;
    protected canAddDie(die: Die, settings?: AddDieToSlotSettings): boolean;
    /**
     * Swap dice inside the slot stock.
     *
     * @param dice the dice to swap
     * @param settings for `updateInformations` and `selectable`
     */
    swapDice(dice: Die[], settings?: AddDieSettings): Promise<boolean[]>;
}
/**
 * A stock with manually placed dice
 */
declare class ManualPositionStock extends DiceStock {
    protected manager: DiceManager;
    protected element: HTMLElement;
    protected updateDisplay: (element: HTMLElement, dice: Die[], lastDie: Die, stock: ManualPositionStock) => any;
    /**
     * @param manager the die manager
     * @param element the stock element (should be an empty HTML Element)
     */
    constructor(manager: DiceManager, element: HTMLElement, settings: DieStockSettings, updateDisplay: (element: HTMLElement, dice: Die[], lastDie: Die, stock: ManualPositionStock) => any);
    /**
     * Add a die to the stock.
     *
     * @param die the die to add
     * @param animation a `DieAnimation` object
     * @param settings a `AddDiceettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    addDie(die: Die, animation?: DieAnimation, settings?: AddDieSettings): Promise<boolean>;
    dieRemoved(die: Die): void;
}
interface AddDieToVoidStockSettings extends AddDieSettings {
    /**
     * Removes the die after adding.
     * Set to false if you want to add the die to the void to stock to animate it to another stock just after.
     * Default true
     */
    remove?: boolean;
}
/**
 * A stock to make dice disappear (to automatically remove disdieed dice, or to represent a bag)
 */
declare class VoidStock extends DiceStock {
    protected manager: DiceManager;
    protected element: HTMLElement;
    /**
     * @param manager the die manager
     * @param element the stock element (should be an empty HTML Element)
     */
    constructor(manager: DiceManager, element: HTMLElement);
    /**
     * Add a die to the stock.
     *
     * @param die the die to add
     * @param animation a `DieAnimation` object
     * @param settings a `AddDieToVoidStockSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    addDie(die: Die, animation?: DieAnimation, settings?: AddDieToVoidStockSettings): Promise<boolean>;
}
interface DiceManagerSettings {
    /**
     * The animation manager used in the game. If not provided, a new one will be instanciated for this die manager. Useful if you use AnimationManager outside of dice manager, to avoid double instanciation.
     */
    animationManager?: AnimationManager;
    dieTypes?: {
        [dieType: number | string]: DieType;
    };
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
declare class DiceManager {
    game: Game;
    private settings;
    animationManager: AnimationManager;
    private stocks;
    private registeredDieTypes;
    /**
     * @param game the BGA game class, usually it will be `this`
     * @param settings: a `DieManagerSettings` object
     */
    constructor(game: Game, settings: DiceManagerSettings);
    /**
     * Returns if the animations are active. Animation aren't active when the window is not visible (`document.visibilityState === 'hidden'`), or `game.instantaneousMode` is true.
     *
     * @returns if the animations are active.
     */
    animationsActive(): boolean;
    addStock(stock: DiceStock): void;
    setDieType(type: number | string, dieType: DieType): void;
    getId(die: Die): string;
    createDieElement(die: Die): HTMLDivElement;
    /**
     * @param die the die informations
     * @return the HTML element of an existing die
     */
    getDieElement(die: Die): HTMLElement;
    /**
     * Remove a die.
     *
     * @param die the die to remove
     * @param settings a `RemoveDieSettings` object
     */
    removeDie(die: Die, settings?: RemoveDieSettings): boolean;
    /**
     * Returns the stock containing the die.
     *
     * @param die the die informations
     * @return the stock containing the die
     */
    getDieStock(die: Die): DiceStock;
    /**
     * Update the die informations. Used when a change visible face.
     *
     * @param die the die informations
     */
    updateDieInformations(die: Die, updateData?: boolean): void;
    /**
     * @returns the class to apply to selectable dice. Default 'bga-dice_selectable-die'.
     */
    getSelectableDieClass(): string | null;
    /**
     * @returns the class to apply to selectable dice. Default 'bga-dice_disabled-die'.
     */
    getUnselectableDieClass(): string | null;
    /**
     * @returns the class to apply to selected dice. Default 'bga-dice_selected-die'.
     */
    getSelectedDieClass(): string | null;
}
declare const define: any;
