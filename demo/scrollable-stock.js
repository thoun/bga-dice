let scrollableStock;

function initScrollableStock() {
    scrollableStock = new ScrollableStock(diceManager, document.getElementById('scrollable-stock'), {
        leftButton: {
            html: '&lt;'
        },
        rightButton: {
            html: '&gt;'
        },
    });

    // add dice
    scrollableStock.addDice([
        { id: getDieId(), type: 3, type_arg: 2, location: 'table', location_arg: 0 },
        { id: getDieId(), type: 1, type_arg: 5, location: 'table', location_arg: 0 },
        { id: getDieId(), type: 3, type_arg: 2, location: 'table', location_arg: 0 },
        { id: getDieId(), type: 4, type_arg: 5, location: 'table', location_arg: 0 },
        { id: getDieId(), type: 3, type_arg: 2, location: 'table', location_arg: 0 },
        { id: getDieId(), type: 4, type_arg: 6, location: 'table', location_arg: 0 },
    ]);
}
