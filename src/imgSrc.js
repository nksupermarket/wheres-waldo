import waldo from './assets/characters/waldo.png';
import wenda from './assets/characters/gf.png';
import woof from './assets/characters/dog.png';
import wizard from './assets/characters/wizard.png';
import odlaw from './assets/characters/evil_waldo.png';

import levelOne from './assets/levels/opt_1*7v_75ZGg1CTmWAw1rEgMHQ.jpeg';
import levelTwo from './assets/levels/opt_wheres-waldo-1.jpeg';
import levelThree from './assets/levels/opt_wheres-waldo-2.jpeg';
import levelFour from './assets/levels/opt_wheres-waldo-3.jpeg';
import levelFive from './assets/levels/opt_wheres-waldo-4.jpeg';
import levelSix from './assets/levels/opt_wheres-waldo-5.jpeg';
import levelSeven from './assets/levels/opt_wheres-waldo-6.jpeg';

import logo from './assets/Wheres_Waldo_-_Logo.png';

const charcImg = {
  waldo,
  wenda,
  woof,
  wizard,
  odlaw,
};

const levels = [
  { img: levelOne, char: ['waldo', 'wenda', 'odlaw'] },
  { img: levelTwo, char: ['waldo', 'wenda', 'wizard', 'odlaw', 'woof'] },
  { img: levelThree, char: ['waldo', 'wenda', 'wizard', 'odlaw', 'woof'] },
  { img: levelFour, char: ['waldo', 'wenda', 'wizard', 'odlaw', 'woof'] },
  { img: levelFive, char: ['waldo', 'wenda', 'wizard', 'odlaw'] },
  { img: levelSix, char: ['waldo', 'wenda', 'wizard', 'odlaw', 'woof'] },
  { img: levelSeven, char: ['waldo', 'wenda', 'wizard', 'odlaw'] },
];

export { charcImg, levels, logo };
