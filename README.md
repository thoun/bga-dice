# Links
[Documentation](https://thoun.github.io/bga-dice/docs/index.html)

[Demo](https://thoun.github.io/bga-dice/demo/index.html)

# Concept
## DiceManager, Stocks and Dice
The DiceManager will handle the creation of all dice used in all stocks linked to it.

For example, if you have dice in 3 stocks on your game, you will create 1 manager and 3 stocks.

# Integration on a BGA project

JS file:
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
        // create the dice manager
        this.diceManager = new BgaDice.Manager(...);

        // ...
    },
```