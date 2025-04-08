let d6LineStock;
let d4LineStock;
let d8LineStock;

function initD6LineStock() {
    d6LineStock = new LineDiceStock(d6Manager, document.getElementById('line-stock'));

    // add dice
    d6LineStock.addDice([
        { id: getDieId(), type: 'white', face: 2, location: 'table', location_arg: 0 },
        { id: getDieId(), type: 'white', face: 2, location: 'table', location_arg: 0 },
        { id: getDieId(), type: 'blue', face: 5, location: 'table', location_arg: 0 },
        { id: getDieId(), type: 'red', face: 1, location: 'table', location_arg: 0 },
        { id: getDieId(), type: 'yellow', face: 6, location: 'table', location_arg: 0 },
        { id: getDieId(), type: 'green', face: 4, location: 'table', location_arg: 0 },
    ]);
}

function initD4LineStock() {
    d4LineStock = new LineDiceStock(d4Manager, document.getElementById('d4-line-stock'));

    // add dice
    d4LineStock.addDice([
        { id: getDieId(), type: 'kot4', face: 3, location: 'table', location_arg: 0 },
    ]);
}

function initD8LineStock() {
    d8LineStock = new LineDiceStock(d8Manager, document.getElementById('d8-line-stock'));

    // add dice
    d8LineStock.addDice([
        { id: getDieId(), type: 'd8', face: 7, location: 'table', location_arg: 0 },
    ]);
}

function roll(changeValue) {
    [d6LineStock, d4LineStock, d8LineStock].forEach(stock => {
        const effect = document.getElementById('roll-effect').value;
        const dice = stock.getDice();
        if (changeValue) {
            dice.forEach(die => die.face = Math.floor(Math.random() * d6Manager.getDieType(die).facesCount) + 1);
        }
        stock.rollDice(dice, {
            effect,
            duration: [800, 1200]
        });
    });
}