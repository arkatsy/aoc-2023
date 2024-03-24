import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const input = fs.readFileSync(path.resolve(import.meta.dirname, "./data"), "utf-8");

// Parse the data
const games = input.split(os.EOL);

const gameSets = games.map((game) => {
  const base = game.split(":");

  const gameId = base[0].split(" ")[1];

  const _sets = base[1].split(";");

  const gameSets = _sets.reduce((acc, curr) => {
    const s = curr.split(",").map((c) => {
      const [count, color] = c.trim().split(" ");
      return { color, count };
    });

    acc.push(s);

    return acc;
  }, []);

  return { id: gameId, sets: gameSets };
});

function solvePart1(gameSets) {
  const cubes = {
    red: 12,
    green: 13,
    blue: 14,
  };

  const validGameIds = gameSets.reduce((acc, curr) => {
    const sets = curr.sets.flat();

    const valid = sets.every((set) => cubes[set.color] >= set.count);

    if (valid) {
      acc.push(curr.id);
    }

    return acc;
  }, []);

  const sum = validGameIds.map(Number).reduce((acc, curr) => acc + curr, 0);

  console.log(`Part 1: ${sum}`);
}

function solvePart2(gameSets) {
  // Find min set of cubes for each game
  const mins = gameSets.map((game) => {
    const sets = game.sets.flat();

    return sets.reduce((acc, curr) => {
      if (!acc[curr.color]) {
        // init
        acc[curr.color] = curr.count;
      }

      if (Number(acc[curr.color]) < Number(curr.count)) {
        acc[curr.color] = curr.count;
      }

      return acc;
    }, {});
  });

  // Calc the power of the mins
  const power = mins.map((min) => {
    return Object.values(min)
      .map(Number)
      .reduce((acc, curr) => acc * curr, 1);
  });

  // sum
  const sum = power.reduce((acc, curr) => acc + curr, 0);

  console.log(`Part 2: ${sum}`);
}

solvePart1(gameSets);
solvePart2(gameSets);
