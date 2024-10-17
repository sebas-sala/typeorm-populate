#!/usr/bin/env node

const seed = require("./seed");
const init = require("./init");
const factory = require("./factory");
const cli = require("./cli");

const [, , subcommand] = process.argv;

async function main() {
  switch (subcommand) {
    case "seed":
      seed();
      break;
    case "init":
      init();
      break;
    case "factory":
      factory();
      break;
    case "cli":
      cli();
      break;
    default:
      cli();
      break;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
