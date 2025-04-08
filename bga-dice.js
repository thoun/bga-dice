function sortFunction() {
    var sortedFields = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        sortedFields[_i] = arguments[_i];
    }
    return function (a, b) {
        for (var i = 0; i < sortedFields.length; i++) {
            var direction = 1;
            var field = sortedFields[i];
            if (field[0] == '-') {
                direction = -1;
                field = field.substring(1);
            }
            else if (field[0] == '+') {
                field = field.substring(1);
            }
            var type = typeof a[field];
            if (type === 'string') {
                var compare = a[field].localeCompare(b[field]);
                if (compare !== 0) {
                    return compare;
                }
            }
            else if (type === 'number') {
                var compare = (a[field] - b[field]) * direction;
                if (compare !== 0) {
                    return compare * direction;
                }
            }
        }
        return 0;
    };
}
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * The abstract stock. It shouldn't be used directly, use stocks that extends it.
 */
var DiceStock = /** @class */ (function () {
    /**
     * @param manager the die manager
     * @param element the stock element (should be an empty HTML Element)
     */
    function DiceStock(manager, element, settings) {
        this.manager = manager;
        this.element = element;
        this.settings = settings;
        this.dice = [];
        this.selectedDice = [];
        this.selectionMode = 'none';
        manager.addStock(this);
        element === null || element === void 0 ? void 0 : element.classList.add('bga-dice_die-stock' /*, this.constructor.name.split(/(?=[A-Z])/).join('-').toLowerCase()* doesn't work in production because of minification */);
        var perspective = this.getPerspective();
        element.style.setProperty('--perspective', perspective ? "".concat(perspective, "px") : 'unset');
        this.bindClick();
        this.sort = settings === null || settings === void 0 ? void 0 : settings.sort;
    }
    /**
     * @returns the dice on the stock
     */
    DiceStock.prototype.getDice = function () {
        return this.dice.slice();
    };
    /**
     * @returns if the stock is empty
     */
    DiceStock.prototype.isEmpty = function () {
        return !this.dice.length;
    };
    /**
     * @returns the selected dice
     */
    DiceStock.prototype.getSelection = function () {
        return this.selectedDice.slice();
    };
    /**
     * @returns the selected dice
     */
    DiceStock.prototype.isSelected = function (die) {
        var _this = this;
        return this.selectedDice.some(function (c) { return _this.manager.getId(c) == _this.manager.getId(die); });
    };
    /**
     * @param die a die
     * @returns if the die is present in the stock
     */
    DiceStock.prototype.contains = function (die) {
        var _this = this;
        return this.dice.some(function (c) { return _this.manager.getId(c) == _this.manager.getId(die); });
    };
    /**
     * @param die a die in the stock
     * @returns the HTML element generated for the die
     */
    DiceStock.prototype.getDieElement = function (die) {
        return this.manager.getDieElement(die);
    };
    /**
     * Checks if the die can be added. By default, only if it isn't already present in the stock.
     *
     * @param die the die to add
     * @param settings the addDie settings
     * @returns if the die can be added
     */
    DiceStock.prototype.canAddDie = function (die, settings) {
        return !this.contains(die);
    };
    /**
     * Add a die to the stock.
     *
     * @param die the die to add
     * @param animation a `DieAnimation` object
     * @param settings a `AddDiceettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    DiceStock.prototype.addDie = function (die, animation, settings) {
        var _this = this;
        if (!this.canAddDie(die, settings)) {
            return Promise.resolve(false);
        }
        // we check if die is in a stock
        var dieElement = this.getDieElement(die);
        var originStock = this.manager.getDieStock(die);
        if (dieElement && !originStock) {
            throw new Error('The die element exists but is not attached to any Stock');
        }
        if (dieElement) { // unselect the die
            originStock.unselectDie(die);
            this.removeSelectionClassesFromElement(dieElement);
        }
        var animationSettings = animation !== null && animation !== void 0 ? animation : {};
        if (originStock) { // if the die is in a Stock, the animation must come from it
            animationSettings.fromStock = originStock;
        }
        var addDieSettings = settings !== null && settings !== void 0 ? settings : {};
        var index = this.getNewDieIndex(die);
        if (index !== undefined) {
            addDieSettings.index = index;
        }
        if (addDieSettings.index !== null && addDieSettings.index !== undefined) {
            this.dice.splice(index, 0, die);
        }
        else {
            this.dice.push(die);
        }
        var promise = dieElement ?
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
            promise.then(function () { var _a; return _this.setSelectableDie(die, (_a = addDieSettings.selectable) !== null && _a !== void 0 ? _a : true); });
        }
        return promise;
    };
    DiceStock.prototype.addExistingDieElement = function (die, dieElement, animation, settings) {
        var _a, _b, _c;
        var toElement = (_a = settings === null || settings === void 0 ? void 0 : settings.forceToElement) !== null && _a !== void 0 ? _a : this.element;
        var insertBefore = undefined;
        if ((settings === null || settings === void 0 ? void 0 : settings.index) === null || (settings === null || settings === void 0 ? void 0 : settings.index) === undefined || !toElement.children.length || (settings === null || settings === void 0 ? void 0 : settings.index) >= toElement.children.length) {
        }
        else {
            insertBefore = toElement.children[settings.index];
        }
        var promise = this.animationFromElement(die, dieElement, (_c = (_b = animation.fromStock) === null || _b === void 0 ? void 0 : _b.element) !== null && _c !== void 0 ? _c : animation.fromElement, toElement, insertBefore, animation, settings);
        return promise;
    };
    DiceStock.prototype.addUnexistingDieElement = function (die, animation, settings) {
        var dieElement = this.manager.createDieElement(die);
        return this.addExistingDieElement(die, dieElement, animation, settings);
    };
    /**
     * @param element The element to animate. The element is added to the destination stock before the animation starts.
     * @param toElement The HTMLElement to attach the die to.
     */
    DiceStock.prototype.animationFromElement = function (die, element, fromElement, toElement, insertBefore, animation, settings) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var result, result;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!document.contains(element)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.manager.animationManager.slideAndAttach(element, toElement, animation, insertBefore)];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, (_a = result === null || result === void 0 ? void 0 : result.played) !== null && _a !== void 0 ? _a : false];
                    case 2:
                        this.manager.animationManager.base.attachToElement(element, toElement, insertBefore);
                        result = null;
                        if (!(!animation.fromStock || settings.fadeIn)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.manager.animationManager.fadeIn(element, fromElement, animation)];
                    case 3:
                        result = _c.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.manager.animationManager.slideIn(element, fromElement, animation)];
                    case 5:
                        result = _c.sent();
                        _c.label = 6;
                    case 6: return [2 /*return*/, (_b = result === null || result === void 0 ? void 0 : result.played) !== null && _b !== void 0 ? _b : false];
                }
            });
        });
    };
    DiceStock.prototype.getNewDieIndex = function (die) {
        if (this.sort) {
            var otherDice = this.getDice();
            for (var i = 0; i < otherDice.length; i++) {
                var otherDie = otherDice[i];
                if (this.sort(die, otherDie) < 0) {
                    return i;
                }
            }
            return otherDice.length;
        }
        else {
            return undefined;
        }
    };
    DiceStock.prototype.addDieElementToParent = function (dieElement, settings) {
        var _a;
        var parent = (_a = settings === null || settings === void 0 ? void 0 : settings.forceToElement) !== null && _a !== void 0 ? _a : this.element;
        if ((settings === null || settings === void 0 ? void 0 : settings.index) === null || (settings === null || settings === void 0 ? void 0 : settings.index) === undefined || !parent.children.length || (settings === null || settings === void 0 ? void 0 : settings.index) >= parent.children.length) {
            parent.appendChild(dieElement);
        }
        else {
            parent.insertBefore(dieElement, parent.children[settings.index]);
        }
    };
    /**
     * Add an array of dice to the stock.
     *
     * @param dice the dice to add
     * @param animation a `DieAnimation` object
     * @param settings a `AddDiceettings` object
     * @param shift if number, the number of milliseconds between each die. if true, chain animations
     */
    DiceStock.prototype.addDice = function (dice, animation, settings, shift) {
        if (shift === void 0) { shift = false; }
        return __awaiter(this, void 0, void 0, function () {
            var promises, result, others, _loop_1, i, results;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.manager.game.bgaAnimationsActive()) {
                            shift = false;
                        }
                        promises = [];
                        if (!(shift === true)) return [3 /*break*/, 4];
                        if (!dice.length) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.addDie(dice[0], animation, settings)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, this.addDice(dice.slice(1), animation, settings, shift)];
                    case 2:
                        others = _a.sent();
                        return [2 /*return*/, result || others];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        if (typeof shift === 'number') {
                            _loop_1 = function (i) {
                                setTimeout(function () { return promises.push(_this.addDie(dice[i], animation, settings)); }, i * shift);
                            };
                            for (i = 0; i < dice.length; i++) {
                                _loop_1(i);
                            }
                        }
                        else {
                            promises = dice.map(function (die) { return _this.addDie(die, animation, settings); });
                        }
                        _a.label = 5;
                    case 5: return [4 /*yield*/, Promise.all(promises)];
                    case 6:
                        results = _a.sent();
                        return [2 /*return*/, results.some(function (result) { return result; })];
                }
            });
        });
    };
    /**
     * Remove a die from the stock.
     *
     * @param die die die to remove
     */
    DiceStock.prototype.removeDie = function (die) {
        if (this.contains(die) && this.element.contains(this.getDieElement(die))) {
            this.manager.removeDie(die);
        }
        this.dieRemoved(die);
    };
    /**
     * Notify the stock that a die is removed.
     *
     * @param die the die to remove
     */
    DiceStock.prototype.dieRemoved = function (die) {
        var _this = this;
        var index = this.dice.findIndex(function (c) { return _this.manager.getId(c) == _this.manager.getId(die); });
        if (index !== -1) {
            this.dice.splice(index, 1);
        }
        if (this.selectedDice.find(function (c) { return _this.manager.getId(c) == _this.manager.getId(die); })) {
            this.unselectDie(die);
        }
    };
    /**
     * Remove a set of dice from the stock.
     *
     * @param dice the dice to remove
     */
    DiceStock.prototype.removeDice = function (dice) {
        var _this = this;
        dice.forEach(function (die) { return _this.removeDie(die); });
    };
    /**
     * Remove all dice from the stock.
     */
    DiceStock.prototype.removeAll = function () {
        var _this = this;
        var dice = this.getDice(); // use a copy of the array as we iterate and modify it at the same time
        dice.forEach(function (die) { return _this.removeDie(die); });
    };
    /**
     * Set if the stock is selectable, and if yes if it can be multiple.
     * If set to 'none', it will unselect all selected dice.
     *
     * @param selectionMode the selection mode
     * @param selectableDice the selectable dice (all if unset). Calls `setSelectableDice` method
     */
    DiceStock.prototype.setSelectionMode = function (selectionMode, selectableDice) {
        var _this = this;
        if (selectionMode !== this.selectionMode) {
            this.unselectAll(true);
        }
        this.dice.forEach(function (die) { return _this.setSelectableDie(die, selectionMode != 'none'); });
        this.element.classList.toggle('bga-dice_selectable-stock', selectionMode != 'none');
        this.selectionMode = selectionMode;
        if (selectionMode === 'none') {
            this.getDice().forEach(function (die) { return _this.removeSelectionClasses(die); });
        }
        else {
            this.setSelectableDice(selectableDice !== null && selectableDice !== void 0 ? selectableDice : this.getDice());
        }
    };
    DiceStock.prototype.setSelectableDie = function (die, selectable) {
        if (this.selectionMode === 'none') {
            return;
        }
        var element = this.getDieElement(die);
        var selectableDiceClass = this.getSelectableDieClass();
        var unselectableDiceClass = this.getUnselectableDieClass();
        if (selectableDiceClass) {
            element.classList.toggle(selectableDiceClass, selectable);
        }
        if (unselectableDiceClass) {
            element.classList.toggle(unselectableDiceClass, !selectable);
        }
        if (!selectable && this.isSelected(die)) {
            this.unselectDie(die, true);
        }
    };
    /**
     * Set the selectable class for each die.
     *
     * @param selectableDice the selectable dice. If unset, all dice are marked selectable. Default unset.
     */
    DiceStock.prototype.setSelectableDice = function (selectableDice) {
        var _this = this;
        if (this.selectionMode === 'none') {
            return;
        }
        var selectableDiceIds = (selectableDice !== null && selectableDice !== void 0 ? selectableDice : this.getDice()).map(function (die) { return _this.manager.getId(die); });
        this.dice.forEach(function (die) {
            return _this.setSelectableDie(die, selectableDiceIds.includes(_this.manager.getId(die)));
        });
    };
    /**
     * Set selected state to a die.
     *
     * @param die the die to select
     */
    DiceStock.prototype.selectDie = function (die, silent) {
        var _this = this;
        var _a;
        if (silent === void 0) { silent = false; }
        if (this.selectionMode == 'none') {
            return;
        }
        var element = this.getDieElement(die);
        var selectableDiceClass = this.getSelectableDieClass();
        if (!element.classList.contains(selectableDiceClass)) {
            return;
        }
        if (this.selectionMode === 'single') {
            this.dice.filter(function (c) { return _this.manager.getId(c) != _this.manager.getId(die); }).forEach(function (c) { return _this.unselectDie(c, true); });
        }
        var selectedDiceClass = this.getSelectedDieClass();
        element.classList.add(selectedDiceClass);
        this.selectedDice.push(die);
        if (!silent) {
            (_a = this.onSelectionChange) === null || _a === void 0 ? void 0 : _a.call(this, this.selectedDice.slice(), die);
        }
    };
    /**
     * Set unselected state to a die.
     *
     * @param die the die to unselect
     */
    DiceStock.prototype.unselectDie = function (die, silent) {
        var _this = this;
        var _a;
        if (silent === void 0) { silent = false; }
        var element = this.getDieElement(die);
        var selectedDiceClass = this.getSelectedDieClass();
        element.classList.remove(selectedDiceClass);
        var index = this.selectedDice.findIndex(function (c) { return _this.manager.getId(c) == _this.manager.getId(die); });
        if (index !== -1) {
            this.selectedDice.splice(index, 1);
        }
        if (!silent) {
            (_a = this.onSelectionChange) === null || _a === void 0 ? void 0 : _a.call(this, this.selectedDice.slice(), die);
        }
    };
    /**
     * Select all dice
     */
    DiceStock.prototype.selectAll = function (silent) {
        var _this = this;
        var _a;
        if (silent === void 0) { silent = false; }
        if (this.selectionMode == 'none') {
            return;
        }
        this.dice.forEach(function (c) { return _this.selectDie(c, true); });
        if (!silent) {
            (_a = this.onSelectionChange) === null || _a === void 0 ? void 0 : _a.call(this, this.selectedDice.slice(), null);
        }
    };
    /**
     * Unelect all dice
     */
    DiceStock.prototype.unselectAll = function (silent) {
        var _this = this;
        var _a;
        if (silent === void 0) { silent = false; }
        var dice = this.getDice(); // use a copy of the array as we iterate and modify it at the same time
        dice.forEach(function (c) { return _this.unselectDie(c, true); });
        if (!silent) {
            (_a = this.onSelectionChange) === null || _a === void 0 ? void 0 : _a.call(this, this.selectedDice.slice(), null);
        }
    };
    DiceStock.prototype.bindClick = function () {
        var _this = this;
        var _a;
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (event) {
            var dieDiv = event.target.closest('.bga-dice_die');
            if (!dieDiv) {
                return;
            }
            var die = _this.dice.find(function (c) { return _this.manager.getDieElementId(c) == dieDiv.id; });
            if (!die) {
                return;
            }
            _this.dieClick(die);
        });
    };
    DiceStock.prototype.dieClick = function (die) {
        var _this = this;
        var _a;
        if (this.selectionMode != 'none') {
            var alreadySelected = this.selectedDice.some(function (c) { return _this.manager.getId(c) == _this.manager.getId(die); });
            if (alreadySelected) {
                this.unselectDie(die);
            }
            else {
                this.selectDie(die);
            }
        }
        (_a = this.onDieClick) === null || _a === void 0 ? void 0 : _a.call(this, die);
    };
    /**
     * @returns the perspective for this stock.
     */
    DiceStock.prototype.getPerspective = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.perspective) === undefined ? this.manager.getPerspective() : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.perspective;
    };
    /**
     * @returns the class to apply to selectable dice. Use class from manager is unset.
     */
    DiceStock.prototype.getSelectableDieClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.selectableDieClass) === undefined ? this.manager.getSelectableDieClass() : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.selectableDieClass;
    };
    /**
     * @returns the class to apply to selectable dice. Use class from manager is unset.
     */
    DiceStock.prototype.getUnselectableDieClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.unselectableDieClass) === undefined ? this.manager.getUnselectableDieClass() : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.unselectableDieClass;
    };
    /**
     * @returns the class to apply to selected dice. Use class from manager is unset.
     */
    DiceStock.prototype.getSelectedDieClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.selectedDieClass) === undefined ? this.manager.getSelectedDieClass() : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.selectedDieClass;
    };
    DiceStock.prototype.removeSelectionClasses = function (die) {
        this.removeSelectionClassesFromElement(this.getDieElement(die));
    };
    DiceStock.prototype.removeSelectionClassesFromElement = function (dieElement) {
        var selectableDiceClass = this.getSelectableDieClass();
        var unselectableDiceClass = this.getUnselectableDieClass();
        var selectedDiceClass = this.getSelectedDieClass();
        dieElement.classList.remove(selectableDiceClass, unselectableDiceClass, selectedDiceClass);
    };
    DiceStock.prototype.getRand = function (min, max) {
        return Math.floor(Math.random() * ((max + 1) - min) + min);
    };
    DiceStock.prototype.getRollAnimation = function (element, duration, deltaYFrom, deltaYTo, moveHorizontally, angle) {
        if (deltaYFrom === void 0) { deltaYFrom = 0; }
        if (deltaYTo === void 0) { deltaYTo = 0; }
        if (moveHorizontally === void 0) { moveHorizontally = true; }
        if (angle === void 0) { angle = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var size, distance, horizontalMargin;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        size = this.manager.getSize();
                        distance = deltaYTo - deltaYFrom;
                        horizontalMargin = function () { return moveHorizontally ? _this.getRand(-size / 4, size / 4) : 0; };
                        return [4 /*yield*/, element.animate([
                                { transform: "translate(".concat(horizontalMargin(), "px, ").concat(deltaYFrom, "px) translateZ(").concat(size * 4, "px) rotate(").concat(angle, "deg)") },
                                { transform: "translate(".concat(horizontalMargin(), "px, ").concat(deltaYFrom + distance * 0.2, "px) rotate(").concat(angle, "deg)") },
                                { transform: "translate(".concat(horizontalMargin(), "px, ").concat(deltaYFrom + distance * 0.4, "px) translateZ(").concat(size * 3, "px) rotate(").concat(angle, "deg)") },
                                { transform: "translate(".concat(horizontalMargin(), "px, ").concat(deltaYFrom + distance * 0.6, "px) rotate(").concat(angle, "deg)") },
                                { transform: "translate(".concat(horizontalMargin(), "px, ").concat(deltaYFrom + distance * 0.8, "px) translateZ(").concat(size * 2, "px) rotate(").concat(angle, "deg)") },
                                { transform: "translate(0px, ".concat(deltaYTo, "px) rotate(").concat(angle, "deg)") },
                            ], duration).finished];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DiceStock.prototype.addRollEffectToDieElement = function (die, element, effect, duration) {
        return __awaiter(this, void 0, void 0, function () {
            var size, _a, angle;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        size = this.manager.getSize();
                        _a = effect;
                        switch (_a) {
                            case 'rollIn': return [3 /*break*/, 1];
                            case 'rollOutPauseAndBack': return [3 /*break*/, 3];
                            case 'turn': return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 1: return [4 /*yield*/, this.getRollAnimation(element, duration, -size * 5, 0)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 3:
                        angle = this.getRand(-45, 45);
                        return [4 /*yield*/, this.getRollAnimation(element, duration, 0, size * 5, true, angle)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, element.animate([
                                { transform: "translate(0px, ".concat(size * 5, "px) rotate(").concat(angle, "deg)") },
                                { transform: "translate(0px, ".concat(size * 5, "px) rotate(").concat(angle, "deg)") },
                            ], duration / 3).finished];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, element.animate([
                                { transform: "translate(0px, ".concat(size * 5, "px) rotate(").concat(angle, "deg)") },
                                { transform: "translate(0px, 0px)" },
                            ], duration / 3).finished];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, this.manager.game.wait(duration)];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    DiceStock.prototype.rollDice = function (dice, settings) {
        var _this = this;
        dice.forEach(function (die) { return _this.rollDie(die, settings); });
    };
    DiceStock.prototype.rollDie = function (die, settings) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var div, faces, rollEffect, animate, duration, getRandDeg;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        div = this.getDieElement(die);
                        faces = div.querySelector('.bga-dice_die-faces');
                        faces.dataset.visibleFace = "".concat(this.manager.getDieFace(die));
                        rollEffect = (_a = settings === null || settings === void 0 ? void 0 : settings.effect) !== null && _a !== void 0 ? _a : 'rollIn';
                        animate = this.manager.game.bgaAnimationsActive() && rollEffect !== 'none';
                        if (!animate) return [3 /*break*/, 2];
                        duration = (_b = settings === null || settings === void 0 ? void 0 : settings.duration) !== null && _b !== void 0 ? _b : 1000;
                        if (Array.isArray(duration)) {
                            duration = this.getRand(duration[0], duration[1]);
                        }
                        getRandDeg = function () { return _this.getRand(540, 720); };
                        return [4 /*yield*/, Promise.all([
                                // dice movement animation (slide with bumps)
                                this.addRollEffectToDieElement(die, div, rollEffect, duration),
                                // dice roll animation (roll on itself)
                                faces.animate([
                                    { transform: "rotateX(".concat(getRandDeg(), "deg) rotateY(").concat(getRandDeg(), "deg) rotateZ(").concat(getRandDeg(), "deg)") },
                                    { transform: "" },
                                ], duration).finished,
                            ])];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return DiceStock;
}());
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * A basic stock for a list of dice, based on flex.
 */
var LineDiceStock = /** @class */ (function (_super) {
    __extends(LineDiceStock, _super);
    /**
     * @param manager the die manager
     * @param element the stock element (should be an empty HTML Element)
     * @param settings a `LineStockSettings` object
     */
    function LineDiceStock(manager, element, settings) {
        var _this = this;
        var _a, _b, _c, _d;
        _this = _super.call(this, manager, element, settings) || this;
        _this.manager = manager;
        _this.element = element;
        element.classList.add('bga-dice_line-stock');
        element.dataset.center = ((_a = settings === null || settings === void 0 ? void 0 : settings.center) !== null && _a !== void 0 ? _a : true).toString();
        element.style.setProperty('--wrap', (_b = settings === null || settings === void 0 ? void 0 : settings.wrap) !== null && _b !== void 0 ? _b : 'wrap');
        element.style.setProperty('--direction', (_c = settings === null || settings === void 0 ? void 0 : settings.direction) !== null && _c !== void 0 ? _c : 'row');
        element.style.setProperty('--gap', (_d = settings === null || settings === void 0 ? void 0 : settings.gap) !== null && _d !== void 0 ? _d : '8px');
        return _this;
    }
    return LineDiceStock;
}(DiceStock));
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/**
 * A stock with fixed slots (some can be empty)
 */
var SlotDiceStock = /** @class */ (function (_super) {
    __extends(SlotDiceStock, _super);
    /**
     * @param manager the die manager
     * @param element the stock element (should be an empty HTML Element)
     * @param settings a `SlotStockSettings` object
     */
    function SlotDiceStock(manager, element, settings) {
        var _this = this;
        var _a, _b;
        _this = _super.call(this, manager, element, settings) || this;
        _this.manager = manager;
        _this.element = element;
        _this.slotsIds = [];
        _this.slots = [];
        element.classList.add('bga-dice_slot-stock');
        _this.mapDieToSlot = settings.mapDieToSlot;
        _this.slotsIds = (_a = settings.slotsIds) !== null && _a !== void 0 ? _a : [];
        _this.slotClasses = (_b = settings.slotClasses) !== null && _b !== void 0 ? _b : [];
        _this.slotsIds.forEach(function (slotId) {
            _this.createSlot(slotId);
        });
        return _this;
    }
    SlotDiceStock.prototype.createSlot = function (slotId) {
        var _a;
        this.slots[slotId] = document.createElement("div");
        this.slots[slotId].dataset.slotId = slotId;
        this.element.appendChild(this.slots[slotId]);
        (_a = this.slots[slotId].classList).add.apply(_a, __spreadArray(['slot'], this.slotClasses, true));
    };
    /**
     * Add a die to the stock.
     *
     * @param die the die to add
     * @param animation a `DieAnimation` object
     * @param settings a `AddDieToSlotSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    SlotDiceStock.prototype.addDie = function (die, animation, settings) {
        var _a, _b;
        var slotId = (_a = settings === null || settings === void 0 ? void 0 : settings.slot) !== null && _a !== void 0 ? _a : (_b = this.mapDieToSlot) === null || _b === void 0 ? void 0 : _b.call(this, die);
        if (slotId === undefined) {
            throw new Error("Impossible to add die to slot : no SlotId. Add slotId to settings or set mapDieToSlot to SlotDie constructor.");
        }
        if (!this.slots[slotId]) {
            throw new Error("Impossible to add die to slot \"".concat(slotId, "\" : slot \"").concat(slotId, "\" doesn't exists."));
        }
        var newSettings = __assign(__assign({}, settings), { forceToElement: this.slots[slotId] });
        return _super.prototype.addDie.call(this, die, animation, newSettings);
    };
    /**
     * Change the slots ids. Will empty the stock before re-creating the slots.
     *
     * @param slotsIds the new slotsIds. Will replace the old ones.
     */
    SlotDiceStock.prototype.setSlotsIds = function (slotsIds) {
        var _this = this;
        if (slotsIds.length == this.slotsIds.length && slotsIds.every(function (slotId, index) { return _this.slotsIds[index] === slotId; })) {
            // no change
            return;
        }
        this.removeAll();
        this.element.innerHTML = '';
        this.slotsIds = slotsIds !== null && slotsIds !== void 0 ? slotsIds : [];
        this.slotsIds.forEach(function (slotId) {
            _this.createSlot(slotId);
        });
    };
    SlotDiceStock.prototype.canAddDie = function (die, settings) {
        var _a, _b;
        if (!this.contains(die)) {
            return true;
        }
        else {
            var currentDicelot = this.getDieElement(die).closest('.slot').dataset.slotId;
            var slotId = (_a = settings === null || settings === void 0 ? void 0 : settings.slot) !== null && _a !== void 0 ? _a : (_b = this.mapDieToSlot) === null || _b === void 0 ? void 0 : _b.call(this, die);
            return currentDicelot != slotId;
        }
    };
    /**
     * Swap dice inside the slot stock.
     *
     * @param dice the dice to swap
     * @param settings for `updateInformations` and `selectable`
     */
    SlotDiceStock.prototype.swapDice = function (dice, settings) {
        var _this = this;
        var elements = dice.map(function (die) { return _this.manager.getDieElement(die); });
        dice.forEach(function (die, index) {
            var dieElement = elements[index];
            var dieIndex = _this.dice.findIndex(function (c) { return _this.manager.getId(c) == _this.manager.getId(die); });
            if (dieIndex !== -1) {
                _this.dice.splice(dieIndex, 1, die);
            }
            _this.manager.updateDieInformations(die);
            _this.removeSelectionClassesFromElement(dieElement);
        });
        var promise = this.manager.animationManager.swap(elements);
        dice.forEach(function (die, index) {
            promise.then(function () {
                var _a;
                //this.manager.animationManager.base.attachToElement(dieElement, this.slots[slotId]);
                _this.setSelectableDie(die, (_a = settings === null || settings === void 0 ? void 0 : settings.selectable) !== null && _a !== void 0 ? _a : true);
            });
        });
        return promise;
    };
    return SlotDiceStock;
}(LineDiceStock));
/**
 * A stock with manually placed dice
 */
var ManualPositionDiceStock = /** @class */ (function (_super) {
    __extends(ManualPositionDiceStock, _super);
    /**
     * @param manager the die manager
     * @param element the stock element (should be an empty HTML Element)
     */
    function ManualPositionDiceStock(manager, element, settings, updateDisplay) {
        var _this = _super.call(this, manager, element, settings) || this;
        _this.manager = manager;
        _this.element = element;
        _this.updateDisplay = updateDisplay;
        element.classList.add('bga-dice_manual-position-stock');
        return _this;
    }
    /**
     * Add a die to the stock.
     *
     * @param die the die to add
     * @param animation a `DieAnimation` object
     * @param settings a `AddDiceettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    ManualPositionDiceStock.prototype.addDie = function (die, animation, settings) {
        var promise = _super.prototype.addDie.call(this, die, animation, settings);
        this.updateDisplay(this.element, this.getDice(), die, this);
        return promise;
    };
    ManualPositionDiceStock.prototype.dieRemoved = function (die) {
        _super.prototype.dieRemoved.call(this, die);
        this.updateDisplay(this.element, this.getDice(), die, this);
    };
    return ManualPositionDiceStock;
}(DiceStock));
/**
 * A stock to make dice disappear (to automatically remove disdieed dice, or to represent a bag)
 */
var VoidDiceStock = /** @class */ (function (_super) {
    __extends(VoidDiceStock, _super);
    /**
     * @param manager the die manager
     * @param element the stock element (should be an empty HTML Element)
     */
    function VoidDiceStock(manager, element) {
        var _this = _super.call(this, manager, element) || this;
        _this.manager = manager;
        _this.element = element;
        element.classList.add('bga-dice_void-stock');
        return _this;
    }
    /**
     * Add a die to the stock.
     *
     * @param die the die to add
     * @param animation a `DieAnimation` object
     * @param settings a `AddDieToVoidStockSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    VoidDiceStock.prototype.addDie = function (die, animation, settings) {
        var _this = this;
        var _a;
        var promise = _super.prototype.addDie.call(this, die, animation, settings);
        // center the element
        var dieElement = this.getDieElement(die);
        var originalLeft = dieElement.style.left;
        var originalTop = dieElement.style.top;
        dieElement.style.left = "".concat((this.element.clientWidth - dieElement.clientWidth) / 2, "px");
        dieElement.style.top = "".concat((this.element.clientHeight - dieElement.clientHeight) / 2, "px");
        if (!promise) {
            console.warn("VoidStock.addDie didn't return a Promise");
            promise = Promise.resolve(false);
        }
        if ((_a = settings === null || settings === void 0 ? void 0 : settings.remove) !== null && _a !== void 0 ? _a : true) {
            return promise.then(function (result) {
                _this.removeDie(die);
                return result;
            });
        }
        else {
            dieElement.style.left = originalLeft;
            dieElement.style.top = originalTop;
            return promise;
        }
    };
    return VoidDiceStock;
}(DiceStock));
var DiceManager = /** @class */ (function () {
    /**
     * @param game the BGA game class, usually it will be `this`
     * @param settings: a `DieManagerSettings` object
     */
    function DiceManager(game, settings) {
        var _a;
        this.game = game;
        this.settings = settings;
        this.stocks = [];
        this.animationManager = (_a = settings.animationManager) !== null && _a !== void 0 ? _a : new AnimationManager(game);
        if (![4, 6, 8].includes(this.getFaces())) {
            throw new Error('Unsupported settings.faces');
        }
    }
    DiceManager.prototype.addStock = function (stock) {
        this.stocks.push(stock);
    };
    DiceManager.prototype.getFaces = function () {
        var _a;
        return (_a = this.settings.faces) !== null && _a !== void 0 ? _a : 6;
    };
    DiceManager.prototype.getSize = function () {
        var _a;
        return (_a = this.settings.size) !== null && _a !== void 0 ? _a : 50;
    };
    DiceManager.prototype.getBorderRadius = function () {
        var _a;
        return (_a = this.settings.borderRadius) !== null && _a !== void 0 ? _a : 0;
    };
    /**
     * @param die the die informations
     * @return the id for a die
     */
    DiceManager.prototype.getId = function (die) {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.settings).getId) === null || _b === void 0 ? void 0 : _b.call(_a, die)) !== null && _c !== void 0 ? _c : "".concat(die.id);
    };
    /**
     * @param card the card informations
     * @return the id for a card element
     */
    DiceManager.prototype.getDieElementId = function (die) {
        return "".concat(this.getType(), "-").concat(this.getId(die));
    };
    /**
     *
     * @returns the type of the dice, either set in the settings or by using game_name if there is only 1 type.
     */
    DiceManager.prototype.getType = function () {
        var _a;
        return (_a = this.settings.type) !== null && _a !== void 0 ? _a : "".concat(this.game.game_name, "-dice");
    };
    /**
     * Return the die face.
     * Default: the face will be set to `die.face`.
     *
     * @param die the die informations
     * @return the die face
     */
    DiceManager.prototype.getDieFace = function (die) {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.settings).getDieFace) === null || _b === void 0 ? void 0 : _b.call(_a, die)) !== null && _c !== void 0 ? _c : die.face;
    };
    DiceManager.prototype.createDieElement = function (die) {
        var _a, _b;
        var id = this.getDieElementId(die);
        if (this.getDieElement(die)) {
            throw new Error("This die already exists ".concat(JSON.stringify(die)));
        }
        var faces = this.getFaces();
        var type = this.getType();
        var element = document.createElement("div");
        element.id = id;
        element.classList.add('bga-dice_die', "bga-dice_die".concat(faces), type);
        element.style.setProperty('--size', "".concat(this.getSize(), "px"));
        element.style.setProperty('--bga-dice_border-radius', "".concat(this.getBorderRadius(), "%"));
        var dieFaces = document.createElement("div");
        dieFaces.classList.add('bga-dice_die-faces');
        dieFaces.dataset.visibleFace = '' + this.getDieFace(die);
        element.appendChild(dieFaces);
        var facesElements = [];
        for (var i = 1; i <= faces; i++) {
            facesElements[i] = document.createElement("div");
            facesElements[i].id = "".concat(id, "-face-").concat(i);
            facesElements[i].classList.add('bga-dice_die-face', "".concat(type, "-face-").concat(i));
            facesElements[i].dataset.face = '' + i;
            dieFaces.appendChild(facesElements[i]);
        }
        document.body.appendChild(element);
        (_b = (_a = this.settings).setupDieDiv) === null || _b === void 0 ? void 0 : _b.call(_a, die, element);
        if (this.settings.setupFaceDiv) {
            for (var i = 1; i <= faces; i++) {
                this.settings.setupFaceDiv(die, facesElements[i], i);
            }
        }
        document.body.removeChild(element);
        return element;
    };
    /**
     * @param die the die informations
     * @return the HTML element of an existing die
     */
    DiceManager.prototype.getDieElement = function (die) {
        return document.getElementById(this.getDieElementId(die));
    };
    /**
     * Remove a die.
     *
     * @param die the die to remove
     */
    DiceManager.prototype.removeDie = function (die) {
        var _a;
        var div = this.getDieElement(die);
        if (!div) {
            return false;
        }
        div.id = "deleted-".concat(div.id);
        div.remove();
        // if the die is in a stock, notify the stock about removal
        (_a = this.getDieStock(die)) === null || _a === void 0 ? void 0 : _a.dieRemoved(die);
        return true;
    };
    /**
     * Returns the stock containing the die.
     *
     * @param die the die informations
     * @return the stock containing the die
     */
    DiceManager.prototype.getDieStock = function (die) {
        return this.stocks.find(function (stock) { return stock.contains(die); });
    };
    /**
     * Update the die informations. Used when a change visible face.
     *
     * @param die the die informations
     */
    DiceManager.prototype.updateDieInformations = function (die, updateData) {
        var _this = this;
        var div = this.getDieElement(die);
        div.querySelector('.bga-dice_die-faces').dataset.visibleFace = '' + this.getDieFace(die);
        if (updateData !== null && updateData !== void 0 ? updateData : true) {
            // die data has changed
            var stock = this.getDieStock(die);
            var dice = stock.getDice();
            var dieIndex = dice.findIndex(function (c) { return _this.getId(c) === _this.getId(die); });
            if (dieIndex !== -1) {
                stock.dice.splice(dieIndex, 1, die);
            }
        }
    };
    /**
     * @returns the default perspective for all stocks.
     */
    DiceManager.prototype.getPerspective = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.perspective) === undefined ? 1000 : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.perspective;
    };
    /**
     * @returns the class to apply to selectable dice. Default 'bga-dice_selectable-die'.
     */
    DiceManager.prototype.getSelectableDieClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.selectableDieClass) === undefined ? 'bga-dice_selectable-die' : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.selectableDieClass;
    };
    /**
     * @returns the class to apply to selectable dice. Default 'bga-dice_disabled-die'.
     */
    DiceManager.prototype.getUnselectableDieClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.unselectableDieClass) === undefined ? 'bga-dice_disabled-die' : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.unselectableDieClass;
    };
    /**
     * @returns the class to apply to selected dice. Default 'bga-dice_selected-die'.
     */
    DiceManager.prototype.getSelectedDieClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.selectedDieClass) === undefined ? 'bga-dice_selected-die' : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.selectedDieClass;
    };
    return DiceManager;
}());
define({
    DiceManager: DiceManager,
    DiceStock: DiceStock,
    LineDiceStock: LineDiceStock,
    SlotDiceStock: SlotDiceStock,
    ManualPositionDiceStock: ManualPositionDiceStock,
    VoidDiceStock: VoidDiceStock,
    sortFunction: sortFunction,
});
