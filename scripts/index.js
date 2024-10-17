#!/usr/bin/env node

const seed = require("./seed");
const init = require("./init");

const [, , subcommand] = process.argv;

async function main() {
  switch (subcommand) {
    case "seed":
      seed();
      break;
    case "init":
      init();
      break;
    case "cli":
      console.log("Running the CLI script...");
      break;
    default:
      console.log("Unknown command:", subcommand);
      console.log("Usage: npx typeorm-populate <command>");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
