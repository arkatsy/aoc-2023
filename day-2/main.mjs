import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const input = fs.readFileSync(path.resolve(import.meta.dirname, "./data"), "utf-8");

const cubes = {
  red: 12,
  green: 13,
  blue: 14,
};

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

// Part 1
const validGameIds = gameSets.reduce((acc, curr) => {
  const sets = curr.sets.flat();

  const valid = sets.every((set) => cubes[set.color] >= set.count);

  if (valid) {
    acc.push(curr.id);
  }

  return acc;
}, []);

console.log(validGameIds.map(Number).reduce((acc, curr) => acc + curr, 0));
