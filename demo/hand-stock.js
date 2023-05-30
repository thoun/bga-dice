let handStock;

function initHandStock() {
    handStock = new HandStock(diceManager, document.getElementById('hand-stock'), {
    });

    // add dice
    handStock.addDice([
        { id: getDieId(), type: 3, type_arg: 2, location: 'table', location_arg: 0 },
        { id: getDieId(), type: 1, type_arg: 5, location: 'table', location_arg: 0 },
        { id: getDieId(), type: 3, type_arg: 2, location: 'table', location_arg: 0 },
        { id: getDieId(), type: 4, type_arg: 5, location: 'table', location_arg: 0 },
        { id: getDieId(), type: 3, type_arg: 2, location: 'table', location_arg: 0 },
        { id: getDieId(), type: 4, type_arg: 6, location: 'table', location_arg: 0 },
    ]);
}
