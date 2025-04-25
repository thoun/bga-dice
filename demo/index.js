let d6LineStock;
let d4LineStock;
let d8LineStock;

function initD6LineStock(BgaDice) {
    d6LineStock = new BgaDice.LineStock(d6Manager, document.getElementById('line-stock'));

    // add dice
    d6LineStock.addDice([
        { id: getDieId(), color: 'white', face: 2, location: 'table', location_arg: 0 },
        { id: getDieId(), color: 'white', face: 2, location: 'table', location_arg: 0 },
        { id: getDieId(), color: 'blue', face: 5, location: 'table', location_arg: 0 },
        { id: getDieId(), color: 'red', face: 1, location: 'table', location_arg: 0 },
        { id: getDieId(), color: 'yellow', face: 6, location: 'table', location_arg: 0 },
        { id: getDieId(), color: 'green', face: 4, location: 'table', location_arg: 0 },
    ]);
}

function initD4LineStock(BgaDice) {
    d4LineStock = new BgaDice.LineStock(d4Manager, document.getElementById('d4-line-stock'));

    // add dice
    d4LineStock.addDice([
        { id: getDieId(), face: 3, location: 'table', location_arg: 0 },
    ]);
}

function initD8LineStock(BgaDice) {
    d8LineStock = new BgaDice.LineStock(d8Manager, document.getElementById('d8-line-stock'));

    // add dice
    d8LineStock.addDice([
        { id: getDieId(), face: 7, location: 'table', location_arg: 0 },
    ]);
}

function roll(changeValue) {
    [d6LineStock, d4LineStock, d8LineStock].forEach((stock, stockIndex) => {
        const effect = document.getElementById('roll-effect').value;
        const dice = stock.getDice();
        if (changeValue) {
            const manager = [d6Manager, d4Manager, d8Manager][stockIndex];
            dice.forEach(die => die.face = Math.floor(Math.random() * manager.getFaces()) + 1);
        }
        stock.rollDice(dice, {
            effect,
            duration: [800, 1200]
        });
    });
}