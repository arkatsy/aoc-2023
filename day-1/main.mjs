import fs from "node:fs";
import assert from "node:assert";
import path from "node:path";
import os from "node:os"

const data = fs.readFileSync(path.resolve(import.meta.dirname, "./data"), "utf-8");

function isNumber(ch) {
  return !Number.isNaN(+ch);
}

function testIsNumber() {
  let samples = new Set([
    { input: "0", expected: true },
    { input: "8", expected: true },
    { input: "c", expected: false },
    { input: "o", expected: false },
    { input: undefined, expected: false },
    { input: "undefined", expected: false },
  ]);

  samples.forEach((sample) => {
    assert.equal(
      isNumber(sample.input),
      sample.expected,
      `isNumber(${sample.input}) should be ${sample.expected}`
    );
  });
}

function solvePart1(data) {
  const calibrationValues = [];

  data.split(os.EOL).forEach((line) => {
    const first = line.split("").find((ch) => isNumber(ch));
    const last = line.split("").findLast((ch) => isNumber(ch));

    calibrationValues.push(`${first}${last}`);
  });

  const sum = calibrationValues.map(Number).reduce((acc, curr) => acc + curr, 0);
  console.log(`Part 1 solution: ${sum}`);
}

function solvePart2(data) {
  const calibrationValues = [];
  const namedDigits = {
    zero: "0",
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
  };

  data.split(os.EOL).forEach((line) => {
    const processed = line
      .split("")
      .reduce((acc, curr) => {
        if (isNumber(curr)) {
          acc.push(curr);
          return acc;
        }
        const lastEntry = acc.at(-1);

        if (isNumber(lastEntry)) {
          acc.push(curr);
        } else {
          if (acc.length === 0) {
            acc.push(curr);
          } else {
            acc[acc.length - 1] += curr;
          }
        }

        return acc;
      }, [])
      .reduce((acc, curr) => {
        if (isNumber(curr)) {
          acc.push(curr);
          return acc;
        }

        let string = curr;

        while (string.length > 0) {
          let matchFound = false;

          for (const [name, value] of Object.entries(namedDigits)) {
            if (string.startsWith(name)) {
              acc.push(value);

              // `name.length - 1` is needed to take into account cases such as: "oneight"
              // "oneight" should result in ["1", "8"]. Without the `-1` we would match only the ["1"]
              string = string.slice(name.length - 1);
              matchFound = true;
              break;
            }
          }

          if (!matchFound) {
            string = string.slice(1);
          }
        }

        return acc;
      }, []);

    calibrationValues.push(`${processed[0]}${processed.at(-1)}`);
  });

  const sum = calibrationValues.map(Number).reduce((acc, curr) => acc + curr, 0);

  console.log(`Part 2 solution: ${sum}`);
}

solvePart1(data);
solvePart2(data);
