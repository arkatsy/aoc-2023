import { readFileSync } from "fs";
import { resolve } from "path";
import assert from "assert/strict";

const eol = /\r?\n|\r|\n/g;

// See day-1/main.mjs
function isNumber(ch) {
  return !Number.isNaN(+ch);
}

const data = readFileSync(resolve(import.meta.dirname, "./data"), "utf-8");

const mini_sample = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`.trim();

const test_sample = `
467..114..
...*......
..35..633.
`.trim();

//   Assumptions:
// - The data shape is a perfect grid. (Number of characters in each row is the same)
//   Instead of converting the data into a 2d array or some other complex structure,
//   we can keep it flat and make use of the total characters in a row as an offset to find adjacent characters.
//
// - A number that's last in a row, can still have a diagonal adjecent symbol on the beginning of the next row.
//   Example:
`
........45
&.........
`;
//   In this case the & is considered to be adjecent to 45.
//   NOTE: This assumption is being used because there is no such case in the input data and will simplify a lot the process.
//
//
// - The sumbols are:
const SYMBOLS = ["*", "$", "-", "+", "&", "%", "#", "@", "/", "="];
//
// - Finding the adjecent characters:
function hasAdjecentSymbol(data, start, end, offset) {
  // We need 2 indices (`start`, `end`) for multiple character numbers

  assert(Array.isArray(data), `\`data\` should be of type array`);
  assert.equal(typeof start, "number", `\`start\` should be of type number, not ${typeof start}`);
  assert.equal(typeof end, "number", `\`end\` should be of type number, not ${typeof end}`);
  assert.equal(typeof offset, "number", `\`offset\` should be of type number, not ${typeof offset}`);

  const _debug = {
    num: data.slice(start, end + 1).join(""),
  };

  // The adjecent characters we need to check are:
  // - left & right:
  //   start - 1 | end + 1
  //
  // - top & bottom + diagonals (range):
  //   top-diagonal = (start - offset) - 1 ... (end - offset) + 1
  //   bottom-diagonal = (start + offset) - 1 ... (end + offset) + 1

  // Check for left & right:
  const leftChar = data[start - 1];
  const rightChar = data[end + 1];
  const isFirstOrLastChar = !leftChar || !rightChar;

  const hasSideSymbol = !isFirstOrLastChar && (isSymbol(leftChar) || isSymbol(rightChar));

  // Check for top & bottom + diagonals (range)
  // top row
  let hasTopSymbol = false;
  const topLeftIdx = (start - offset) - 1; // prettier-ignore
  const topRightIdx = (end - offset) + 1; // prettier-ignore

  const isFirstRow = !topLeftIdx || !topRightIdx;
  hasTopSymbol = !isFirstRow && data.slice(topLeftIdx, topRightIdx + 1).some(isSymbol);

  // bottom row
  let hasBottomSymbol = false;
  const bottomLeftIdx = (start + offset) - 1; // prettier-ignore
  const bottomRightIdx = (end + offset) + 1; // prettier-ignore
  const isLastRow = !topLeftIdx || !topRightIdx;

  hasBottomSymbol = !isLastRow && data.slice(bottomLeftIdx, bottomRightIdx + 1).some(isSymbol);
  return hasSideSymbol || hasTopSymbol || hasBottomSymbol;
}

const isSymbol = (char) => {
  return SYMBOLS.includes(char);
};

const flattened = data.split(eol).join("").split("");
const offset = data.split(eol)[0].length;

const numsWithAdjecentSymbols = [];

let cursor = 0;
while (cursor < flattened.length) {
  let char = flattened[cursor];

  if (isNumber(char)) {
    let __cursor = cursor + 1;
    let val = char;
    while (isNumber(flattened[__cursor])) {
      val += flattened[__cursor];
      __cursor++;
    }
    if (hasAdjecentSymbol(flattened, cursor, __cursor - 1, offset)) {
      numsWithAdjecentSymbols.push(val);
    }

    cursor = __cursor;
    continue;
  }

  cursor++;
}

const sum = numsWithAdjecentSymbols.map(Number).reduce((acc, curr) => acc + curr, 0);
console.log(`Part 1: `, sum);
