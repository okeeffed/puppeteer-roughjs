/**
 * Usage from CLI:
 *
 * node index.js "Testing this this{},Another one,Third one{fill: 'red'}"
 *
 * @see https://roughjs.com/
 */
const puppeteer = require('puppeteer');
const argv = require('yargs-parser')(process.argv.slice(2));
const path = require('path');

const help = `
rough - Quick RoughJS diagram generator

Examples
---

# Basic with three boxes
rough "First box, no options {} | Second | Third with red fill {fill: 'red'}"

# More Complex Config
rough "Testing this this{fill: 'blue', fillWeight: 3, hachureGap: 8} | Another one | Third one{fill: 'red'} | Final square {fillStyle: 'solid'}"

# Example with the resizing
rough "This is a very long sentence that will resize the box | This box will keep that width {fill: 'yellow', hachureGap: 3} "

# Solid Fill
rough "Lorem Ipsum | Run out of things to say {fill: 'yellow', fillStyle: 'solid'}"

Rough Options
---

hachureAngle: 60 // angle of hachure
hachureGap: 8 // gap between hachure lines
fillStyle: 'solid' // solid fill
fillWeight: 3 // thicker lines for hachure
`;

// Check for help or any argument length.
// If not give, log out help and exit.
if (argv.help || !argv._.length) {
  console.log(help);
  process.exit();
}

/** Constants */
// Allocated size per character
const PER_CHAR = 8;
const HEIGHT = 80;
// Displacement between each box
const DISPLACEMENT = 24;
// Desired padding around the box from the edges
const PADDING = 10;

/** Fetching arguments */
const [args] = argv._;
const shapes = args.split('|');
// Used later as a "global" store for
// parsed text and options.
const shapeObjs = [];

/**
 * Add a rectangle to the canvas
 *
 * Stringify slice is to help remove quotations.
 *
 * @param {*} x
 * @param {*} y
 * @param {*} width
 * @param {*} height
 * @param {*} [options={}]
 * @returns
 */
const addRectangle = (x, y, width, height, options = null) => {
  let str = `rc.rectangle(${x + PADDING}, ${y + PADDING}, ${
    width - PADDING * 2
  }, ${height - PADDING * 2}`;

  if (options) {
    str += `, ${JSON.stringify(options).slice(1, -1)}`;
  }

  // closing parens
  str += `);`;

  return str;
};

const addTextToRectangle = (text, x, y, width, height) =>
  `addTextToRectangle("${text}", ${x}, ${y}, ${width}, ${height});`;

// const addCircle = (centerX, centerY, diameter) => {
//   return `rc.circle(${centerX}, ${centerY}, ${diameter});`;
// };

const addLine = (x1, y1, x2, y2) => `rc.line(${x1}, ${y1}, ${x2}, ${y2});`;

// const addTextToCircle = (text, centerX, centerY) =>
//   `addTextToCircle(${text}, ${centerX}, ${centerY})`;

const generateString = () => {
  let len = 0;

  for (const shape of shapes) {
    const hasOptions = shape.indexOf('{');
    if (hasOptions > 0) {
      const options = shape.slice(hasOptions);
      const text = shape.substr(0, hasOptions).trim();
      shapeObjs.push({
        options,
        text,
      });

      if (text.length > len) {
        len = text.length;
      }
    } else {
      // renaming for understanding
      const text = shape.trim();
      shapeObjs.push({
        text,
      });

      if (text.length > len) {
        len = text.length;
      }
    }
  }

  let js = '';

  const WIDTH = len * PER_CHAR + DISPLACEMENT;

  shapeObjs.map((obj, index) => {
    const startY = index * (HEIGHT + DISPLACEMENT);

    js += `\n${addRectangle(0, startY, WIDTH, HEIGHT, obj.options)}`;
    js += `\n${addTextToRectangle(obj.text, 0, startY, WIDTH, HEIGHT)}`;

    if (index > 0) {
      js += `\n${addLine(WIDTH / 2, startY - DISPLACEMENT, WIDTH / 2, startY)}`;
    }
  });

  return js;
};

const script = `
const addTextToRectangle = (text, x, y, width, height) => {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.font = '16px Open Sans';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.fillText(text, x + width / 2, y + height / 2);
};

const addTextToCircle = (text, centerX, centerY) => {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.font = '16px Open Sans';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.fillText(text, centerX, centerY);
};

const rc = rough.canvas(document.getElementById('canvas'));
${generateString()}
`;

/**
 * Based on input, it will figure out the desired
 * width of the boxes. We essentially take the text
 * between the pipes, abstract any config, trim it
 * and then return the size to be used for width
 * calculation.
 *
 * @returns {number} Length of largest string
 */
const calcLongestTextSize = () => {
  let len = 0;

  for (const shape of shapes) {
    const hasOptions = shape.indexOf('{');
    if (hasOptions > 0) {
      const text = shape.substr(0, hasOptions).trim();

      if (text.length > len) {
        len = text.length;
      }
    } else {
      // renaming for understanding
      const text = shape.trim();

      if (text.length > len) {
        len = text.length;
      }
    }
  }

  return len;
};

const CALCULATED_WIDTH = calcLongestTextSize() * PER_CHAR + DISPLACEMENT;
const CALCULATED_HEIGHT = shapes.length * (DISPLACEMENT + HEIGHT) - PADDING * 2;

const html = `<!DOCTYPE html>
<html>
  <head>
    <!-- The loading of RoughJS is deferred to speed up page rendering -->
    <script src="https://cdn.jsdelivr.net/npm/roughjs@4.3.1/bundled/rough.js" integrity="sha256-/9PZn0Dy4EaX+C+sZSpiFxTimvbrTSoeCj6XwK2vIFg=" crossorigin="anonymous"></script>
    <style>
      @font-face { font-family: 'Open Sans'; src: url('OpenSans-Regular.ttf'); } 
    </style>
  </head>
  <canvas id="canvas" width="${CALCULATED_WIDTH}px" height="${CALCULATED_HEIGHT}px" style="display: inline-block;"></canvas>
  <script>
    ${script}
  </script>
</html>`;

if (argv.v) {
  console.log(html);
}

const main = async () => {
  let browser;
  try {
    // Log out global config taken from command-line
    console.log('\nBeginning Roughjs canvas generation...');
    console.log('\nConfig:', shapeObjs);

    // Launch Puppeteer and setup a new page
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Tell Puppeteer to load our HTML variable.
    // Wait until "networkidle0", which from the
    // docs means "consider navigation to be finished
    // when there are no more than 0 network connections
    // for at least 500 ms."
    await page.goto(`data:text/html,${html}`, { waitUntil: 'networkidle0' });

    // Wait for the <span id="canvas" /> element to be visible
    // and assign it to "element".
    const element = await page.$('#canvas');

    // Create a screenshot and save it locally to "math.png"
    await element.screenshot({
      path: path.resolve(process.cwd(), 'rough.png'),
    });
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
    console.log('Completed!');
  }
};

main();
