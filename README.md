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
loadBgaGameLib('bga-dice', '0.x');

/* ... */

    constructor: function() {
        // create the dice manager
        this.diceManager = new BgaDice.Manager(...);

        // ...
    },
```