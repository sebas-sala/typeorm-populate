#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const inquirer = require("inquirer");
const { exec } = require("node:child_process");

async function promptForSeedFile() {
  const { seedFile } = await inquirer.createPromptModule()({
    type: "input",
    name: "seedFile",
    message: "Enter the path to the seed file (default: src/database/seed.ts):",
    default: "src/database/seed.ts",
  });

  return path.resolve(process.cwd(), seedFile);
}

async function main() {
  const seedFilePath = await promptForSeedFile();

  if (fs.existsSync(seedFilePath)) {
    exec(`npx ts-node ${seedFilePath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing seed file: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
  } else {
    console.log(`Seed file not found at ${seedFilePath}`);
  }
}

module.exports = main;
