let manualPositionDiagonalStock;
let manualPositionCurveStock;

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
    manualPositionDiagonalStock = new BgaDice.ManualPositionStock(d6Manager, document.getElementById('manual-position-diagonal-stock'), undefined, manualPositionDiagonalUpdateDisplay);

    // add dice
    manualPositionDiagonalStock.addDice([
        { id: getDieId(), type: 0, type_arg: 2, location: 'table', location_arg: 0, face: 2, },
        { id: getDieId(), type: 0, type_arg: 5, location: 'table', location_arg: 0, face: 3, },
        { id: getDieId(), type: 0, type_arg: 2, location: 'table', location_arg: 0, face: 4, },
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
    const dieSize = 50;

    dice.forEach((die, index) => {
        const dieDiv = stock.getDieElement(die);
        const left = canvasWidth / 2 + ((dieSize + 10) * (index - (dice.length) / 2));
        const x = (left + dieSize / 2) / curveXScale;

        const y = reallyPoorBezierResolver(curvePoints, x);

        dieDiv.style.left = `${left}px`;
        dieDiv.style.top = `${y * curveYScale - dieSize / 2}px`;
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

    manualPositionCurveStock = new BgaDice.ManualPositionStock(d6Manager, document.getElementById('manual-position-curve-stock'), undefined, manualPositionCurveUpdateDisplay);

    // add dice
    manualPositionCurveStock.addDice([
        { id: getDieId(), type: 0, type_arg: 2, location: 'table', location_arg: 0, face: 5, },
        { id: getDieId(), type: 0, type_arg: 5, location: 'table', location_arg: 0, face: 6, },
        { id: getDieId(), type: 0, type_arg: 2, location: 'table', location_arg: 0, face: 1, },
    ]);
}

function addDieToManualCurveStock(fromElement) {
    manualPositionCurveStock.addDie(
        { id: getDieId(), type: 3, type_arg: 2, location: 'table', location_arg: 0, face: 6 },
        {
            fromElement: fromElement,
            originalSide: 'back'
        }
    );
}

function removeDieToManualCurveStock() {
    if (!manualPositionCurveStock.isEmpty()) {
        manualPositionCurveStock.removeDie(manualPositionCurveStock.getDice()[0]);
    }
}

