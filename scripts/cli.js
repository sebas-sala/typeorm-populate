const inquirer = require("inquirer");
const seed = require("./seed");
const init = require("./init");
const factory = require("./factory");

async function promptAction() {
  return inquirer.createPromptModule()({
    type: "list",
    name: "action",
    message: "What do you want to do?",
    choices: [
      { name: "Initialize the project", value: "init" },
      { name: "Seed the database", value: "seed" },
      { name: "Create a new factory", value: "factory" },
    ],
  });
}

async function main() {
  const { action } = await promptAction();

  switch (action) {
    case "seed":
      seed();
      break;
    case "init":
      init();
      break;
    case "factory":
      factory();
      break;
    default:
      console.log("Unknown action:", action);
  }
}

module.exports = main;
