let gameLoaded = false;
let animationManager;

window.onload = setTimeout(() => gameLoaded = true, 500);

let game = {
    instantaneousMode: false,
    
    addTooltipHtml: (divId, tooltip) => { document.getElementById(divId).title = tooltip },

    bgaAnimationsActive: function() {
        return document.visibilityState !== 'hidden' && !this.instantaneousMode && gameLoaded;
    },
};

function initCommon() {
    animationManager = new AnimationManager({
        animationsActive: () => game.bgaAnimationsActive(),
    });

    document.body.insertAdjacentHTML('afterbegin', `    
    <div class="nav">
        <a href="index.html">Index</a> | 
        <a href="stocks.html">Stocks</a> | 
        <a href="selection.html">Die selection</a> | 
        <a href="custom.html">Custom die type</a>
    </div>
    <div>
        <input type="checkbox" id="instantaneousMode" onclick="game.instantaneousMode = !game.instantaneousMode">
        <label for="instantaneousMode">Instantaneous mode (to simulate fast replay)</label>
    </div>
    `);
}

let dieId = 1;
function getDieId() {
    return dieId++;
}