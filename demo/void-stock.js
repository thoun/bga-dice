let voidStock;

function initVoidStock(BgaDice) {
    voidStock = new BgaDice.VoidStock(d6Manager, document.getElementById('void-stock'));
}

function addDieToVoidStock(fromElement) {
    if (d6LineStock.isEmpty()) {
        throw new Error('no die in LineStock');
    }

    const die = d6LineStock.getDice()[0];
    voidStock.addDie(die);
}
