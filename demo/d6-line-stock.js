let d6LineStock;

function initD6LineStock(selectable = false) {
    d6LineStock = new LineDiceStock(d6Manager, document.getElementById('line-stock'), {
        sort: sortFunction('type', 'type_arg')
    });
    d6LineStock.setSelectionMode(selectable ? 'multiple' : 'none');
    d6LineStock.onSelectionChange = (selection, lastChange) => {
        logDiv = document.getElementById('line-stock-last-selection-change');
        if (logDiv) {
            logDiv.innerHTML = `<br>selection = ${JSON.stringify(selection)},<br>lastChange = ${JSON.stringify(lastChange)}`;
        }
    };
    d6LineStock.onDieClick = (die) => {
        logDiv = document.getElementById('line-stock-last-click');
        if (logDiv) {
            logDiv.innerHTML = `<br>clicked die = ${JSON.stringify(die)}`;
        }
    };

    // add dice
    d6LineStock.addDice([
        { id: getDieId(), type: 0, type_arg: 2, location: 'table', location_arg: 0, face: 2, },
        { id: getDieId(), type: 0, type_arg: 5, location: 'table', location_arg: 0, face: 5, },
        { id: getDieId(), type: 0, type_arg: 12, location: 'table', location_arg: 0, face: 3, },
        { id: getDieId(), type: 0, type_arg: 9, location: 'table', location_arg: 0, face: 4, },
    ]);
}

function selectionTypeChange(type) {
    d6LineStock.setSelectionMode(type);
}

function setSelectableDice(all) {
    d6LineStock.setSelectableDice(d6LineStock.getDice().filter((die, index) => all ? true : index % 2));
}

function addDieToLineStockWithAnimation(fromElement, customAnimation) {
    const animationSettings = {
        fromElement: fromElement,
        originalSide: 'back'
    };

    if (customAnimation) {
        animationSettings.animation = new BgaAnimation(stockSlideWithDoubleLoopAnimation, {});
    }

    d6LineStock.addDie(
        { id: getDieId(), type: 0 + Math.floor(Math.random() * 4), type_arg: 1 + Math.floor(Math.random() * 10), location: 'table', location_arg: 0 },
        animationSettings
    );
}

function addDieToLineStockFromVoidStock() {
    const die = { id: getDieId(), type: 0 + Math.floor(Math.random() * 4), type_arg: 1 + Math.floor(Math.random() * 10), location: 'table', location_arg: 0 }
    voidStock.addDie({ id: die.id }, undefined, { remove: false, });
    d6LineStock.addDie(die);
}
