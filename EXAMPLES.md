# Code example
## Example of integration

```js
define([
   "dojo","dojo/_base/declare",
   "dojo/debounce",
   "ebg/core/gamegui",
   /*...,*/
   getLibUrl('bga-animations', '0.0.x'),
   getLibUrl('bga-dice', '0.0.x'),
],
function (dojo, declare, debounce, gamegui, /*...,*/, BgaAnimations, BgaDice) {
    // make sure the BgaAnimations variable match the above array index, if `getLibUrl('bga-animations', '0.0.x')` is at the 6th position of the array, BgaAnimations should be the 6th param
   return declare("bgagame.mygame", gamegui, {
      setup: function() {

        // create the animation manager, used by the dice manager
        this.animationManager = new BgaAnimations.Manager({
            animationsActive: () => this.bgaAnimationsActive(),
        });

        // create the dice manager
        this.diceManager = new BgaDice.Manager({
            animationManager: this.animationManager,
            type: 'colored-die',
            borderRadius: 12,
        });

        // create the stock
        this.stock = new BgaDice.LineStock(this.diceManager, document.getElementById('dice-stock'));

        this.stock.addDice([
            { id: getDieId(), type: 'white', face: 2, location: 'table', location_arg: 0 },
            { id: getDieId(), type: 'black', face: 5, location: 'table', location_arg: 0 },
        ]);
```

## Example of rolling dice
```js
    const dice = lineStock.getDice();
    dice.forEach(die => die.value = Math.floor(Math.random() * 6) + 1); // set the new face of each dice
    lineStock.rollDice(dice, {
        effect: 'rollIn',
        duration: [800, 1200] // random duration between 800ms and 1200ms
    });
```
