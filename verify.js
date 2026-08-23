const fs = require('fs');
const files = ['memories.html', 'index.html', 'story.html', 'celebrate.html', 'css/style.css', 'js/main.js', 'js/music-player.js'];

// 1. Check conflict markers
let allClean = true;
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  if (c.includes('>>>>>>>')) { console.log('CONFLICT in ' + f); allClean = false; }
}
console.log('1. No conflict markers: ' + allClean);

// 2. Check birthday banner
for (const f of ['index.html', 'story.html', 'celebrate.html', 'memories.html']) {
  const c = fs.readFileSync(f, 'utf8');
  console.log('2. ' + f + ' has banner: ' + c.includes('birthday-banner'));
}

// 3. Check Memory Stream
const memHtml = fs.readFileSync('memories.html', 'utf8');
console.log('3. memories.html has mem-stream: ' + memHtml.includes('mem-stream-track'));
const memCss = fs.readFileSync('css/style.css', 'utf8');
console.log('4. CSS has .mem-stream-track: ' + memCss.includes('.mem-stream-track'));
console.log('5. CSS has .mem-stream-item: ' + memCss.includes('.mem-stream-item'));
console.log('6. CSS has streamItemReveal: ' + memCss.includes('streamItemReveal'));
const memJs = fs.readFileSync('js/main.js', 'utf8');
console.log('7. JS has playStream: ' + memJs.includes('playStream'));
console.log('8. JS has pauseStream: ' + memJs.includes('pauseStream'));

// 4. Check CSS braces balanced
const openB = (memCss.match(/{/g) || []).length;
const closeB = (memCss.match(/}/g) || []).length;
console.log('9. CSS braces balanced: ' + (openB === closeB) + ' (' + openB + '/' + closeB + ')');

// 5. Check reduced motion includes mem-stream-item
console.log('10. Reduced-motion has mem-stream: ' + memCss.includes('.mem-stream-item, .film-frame'));

// 6. Check stream controls CSS exists
console.log('11. CSS has .stream-control-btn: ' + memCss.includes('.stream-control-btn'));
console.log('12. CSS has .stream-controls-fixed: ' + memCss.includes('.stream-controls-fixed'));
