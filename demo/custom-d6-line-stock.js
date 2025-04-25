let customD6LineStock;

function initCustomD6LineStock(BgaDice) {
    customD6LineStock = new BgaDice.LineStock(customD6Manager, document.getElementById('line-stock'), {
        sort: BgaDice.sort('color', 'face'),
        direction: 'column',
        center: true,
    });

    // add dice
    customD6LineStock.addDice([
        { id: getDieId(), type: 'takenokolor', type_arg: 2, location: 'table', location_arg: 0, color: '#FBB0D0' }, // pink
        { id: getDieId(), type: 'takenokolor', type_arg: 5, location: 'table', location_arg: 0, color: '#F9EC29' }, // yellow
        { id: getDieId(), type: 'takenokolor', type_arg: 12, location: 'table', location_arg: 0, color: '#75D4FE' }, // blue
        { id: getDieId(), type: 'takenokolor', type_arg: 9, location: 'table', location_arg: 0, color: '#24EA57' }, // green
    ]);
}

function roll() {
    const dice = customD6LineStock.getDice();
    dice.forEach(die => die.value = Math.floor(Math.random() * 6) + 1);
    customD6LineStock.rollDice(dice, {
        effect: 'rollIn',
        duration: [800, 1200]
    });
}