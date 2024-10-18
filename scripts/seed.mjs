#!/usr/bin/env node

import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import inquirer from "inquirer";

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
    console.log("Seeding the database...");
    exec(`npx tsx ${seedFilePath}`, (error) => {
      if (error) {
        console.error(`Error executing seed file: ${error.message}`);
        return;
      }

      console.log("Database seeded successfully.");
    });
  } else {
    console.log(`Seed file not found at ${seedFilePath}`);
    return;
  }
}

export { main as seed };
