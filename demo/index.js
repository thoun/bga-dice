let lineStock;

function initLineStock() {
    lineStock = new LineStock(diceManager, document.getElementById('line-stock'), {
        //sort: sortFunction('type', 'type_arg')
    });
    /*lineStock.setSelectionMode('multiple');
    lineStock.onSelectionChange = (selection, lastChange) => {
        logDiv = document.getElementById('line-stock-last-selection-change');
        if (logDiv) {
            logDiv.innerHTML = `selection = ${JSON.stringify(selection)}, lastChange = ${JSON.stringify(lastChange)}`;
        }
    }*/

    // add dice
    lineStock.addDice([
        { id: getDieId(), type: 'white', face: 2, location: 'table', location_arg: 0 },
        { id: getDieId(), type: 'blue', face: 5, location: 'table', location_arg: 0 },
        { id: getDieId(), type: 'red', face: 1, location: 'table', location_arg: 0 },
    ]);
}