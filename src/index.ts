/**
 * BgaDice depends on BgaAnimations.
 * 
 * Currently the bga-animations.d.ts files are copied on the demo folder, another solution would be to add this to the package.json :
 * 
  "peerDependencies": {
    "bga-animations": "git+ssh://git@gitlab.bga.li:boardgamearena/game-libs/bga-animations.git#0.0.1"
  },
 * 
 */

  import './bga-dice.scss';
  import { DiceManager } from './dice-manager';
  import { sort } from './sort';
  
  import { DiceStock } from "./stocks/dice-stock";
  import { LineStock } from "./stocks/line-stock";
  import { ManualPositionStock } from './stocks/manual-position-stock';
  import { SlotStock } from './stocks/slot-stock';
  import { VoidStock } from './stocks/void-stock';
  
  export {
    DiceManager as Manager,
    sort,
  
    DiceStock,
    LineStock,
    ManualPositionStock,
    SlotStock,
    VoidStock,
}