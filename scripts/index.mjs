#!/usr/bin/env node

import { factory } from "./factory.mjs";
import { seed } from "./seed.mjs";
import { init } from "./init.mjs";
import { cli } from "./cli.mjs";

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
