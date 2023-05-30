let manualPositionDiagonalStock;
let manualPositionCurveStock;
let manualPositionFitStock;

function manualPositionDiagonalUpdateDisplay(element, dice, lastDie, stock) {
    dice.forEach((die, index) => {
        const dieDiv = stock.getDieElement(die);
        dieDiv.style.left = `${ 100 * index + 10 * index }px`;
        dieDiv.style.top = `${ 10 * index }px`;
    });

    element.style.width = `${ 100 * dice.length + 10 * (dice.length - 1) }px`;
    element.style.height = `${ 150 + 10 * (dice.length - 1) }px`;
}

function initManualPositionDiagonalStock() {
    manualPositionDiagonalStock = new ManualPositionStock(diceManager, document.getElementById('manual-position-diagonal-stock'), undefined, manualPositionDiagonalUpdateDisplay);

    // add dice
    manualPositionDiagonalStock.addDice([
        { id: getDieId(), type: 3, type_arg: 2, location: 'table', location_arg: 0 },
        { id: getDieId(), type: 1, type_arg: 5, location: 'table', location_arg: 0 },
        { id: getDieId(), type: 3, type_arg: 2, location: 'table', location_arg: 0 },
    ]);
}

const curvePoints = [{x:0,y:2},{x:2,y:3},{x:3,y:4},{x:4,y:2},{x:5,y:6}];
let curveXScale;
let curveYScale;
let canvasWidth;

function reallyPoorBezierResolver(curvePoints, x) {
    // TODO find a method that get y from x using curvePoints using Bezier

    for (let i=0; i<curvePoints.length - 2; i++) {
        if (x >= curvePoints[i].x && x <= curvePoints[i+1].x) {
            const relativeDistance = (x - curvePoints[i].x) / (curvePoints[i+1].x - curvePoints[i].x);
            return curvePoints[i].y + (curvePoints[i+1].y - curvePoints[i].y) * relativeDistance;
        }
    }

    throw new Error('invalid x');
}

function manualPositionCurveUpdateDisplay(element, dice, lastDie, stock) {
    dice.forEach((die, index) => {
        const dieDiv = stock.getDieElement(die);
        const left = canvasWidth / 2 + ((dieWidth + 10) * (index - (dice.length) / 2));
        const x = (left + dieWidth / 2) / curveXScale;

        const y = reallyPoorBezierResolver(curvePoints, x);

        dieDiv.style.left = `${left}px`;
        dieDiv.style.top = `${y * curveYScale - dieHeight / 2}px`;
    });
}

function initManualPositionCurveStock() {
    const maxX = 5;
    const maxY = 8;

    var points = curvePoints;
    var cv = document.getElementById("curveCanvas");
    canvasWidth = cv.clientWidth;
    var ctx = cv.getContext("2d");
    const xScale = cv.clientWidth / maxX;
    const yScale = canvasWidth / maxY;
    curveXScale = xScale;
    curveYScale = yScale;
    ctx.moveTo(points[0].x * xScale, points[0].y * yScale);
    
    for (var i = 0; i < points.length-1; i ++) {
      var x_mid = (points[i].x + points[i+1].x) / 2 * xScale;
      var y_mid = (points[i].y + points[i+1].y) / 2 * yScale;
      var cp_x1 = (x_mid + points[i].x * xScale) / 2;
      var cp_x2 = (x_mid + points[i+1].x * xScale) / 2;
      ctx.quadraticCurveTo(cp_x1,points[i].y * yScale ,x_mid, y_mid);
      ctx.quadraticCurveTo(cp_x2,points[i+1].y * yScale,points[i+1].x * xScale, points[i+1].y * yScale);
    }
    ctx.stroke();

    manualPositionCurveStock = new ManualPositionStock(diceManager, document.getElementById('manual-position-curve-stock'), undefined, manualPositionCurveUpdateDisplay);

    // add dice
    manualPositionCurveStock.addDice([
        { id: getDieId(), type: 3, type_arg: 2, location: 'table', location_arg: 0 },
        { id: getDieId(), type: 1, type_arg: 5, location: 'table', location_arg: 0 },
        { id: getDieId(), type: 3, type_arg: 2, location: 'table', location_arg: 0 },
    ]);
}

function manualPositionFitUpdateDisplay(element, dice, lastDie, stock) {
    const halfClientWidth = element.clientWidth / 2;
    const MARGIN = 8;
    const DIE_WIDTH = 100;
    let dieDistance = DIE_WIDTH + MARGIN;
    const containerWidth = element.clientWidth;
    const uncompressedWidth = (dice.length * DIE_WIDTH) + ((dice.length - 1) * MARGIN);
    if (uncompressedWidth > containerWidth) {
        dieDistance = Math.floor(DIE_WIDTH * containerWidth / (dice.length * DIE_WIDTH));
    }

    dice.forEach((die, index) => {
        const dieDiv = stock.getDieElement(die);
        const dieLeft = halfClientWidth + dieDistance * (index - (dice.length - 1) / 2);

        dieDiv.style.left = `${ dieLeft - DIE_WIDTH / 2 }px`;
    });
}

function initManualPositionFitStock() {
    manualPositionFitStock = new ManualPositionStock(diceManager, document.getElementById('manual-position-fit-stock'), undefined, manualPositionFitUpdateDisplay);

    // add dice
    manualPositionFitStock.addDice([
        { id: getDieId(), type: 3, type_arg: 2, location: 'table', location_arg: 0 },
        { id: getDieId(), type: 1, type_arg: 5, location: 'table', location_arg: 0 },
    ]);
}

function addDieToManualFitStock(fromElement) {
    manualPositionFitStock.addDie(
        { id: getDieId(), type: 3, type_arg: 2, location: 'table', location_arg: 0 },
        {
            fromElement: fromElement,
            originalSide: 'back'
        }
    );
}

function removeDieToManualFitStock() {
    if (!manualPositionFitStock.isEmpty()) {
        manualPositionFitStock.removeDie(manualPositionFitStock.getDice()[0]);
    }
}
