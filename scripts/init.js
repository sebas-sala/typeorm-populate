#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const inquirer = require("inquirer");

const projectRoot = process.cwd();

const factoriesContent = "export const factories = { };";

const seedContent = `
import { DataSource } from "typeorm";
import { factories } from "./factories";
import { TypeormPopulate } from "typeorm-populate";

(async () => {
	const dataSource = new DataSource({
		type: "sqlite",
		database: ":memory:",
		synchronize: true,
		entities: [],
	});

	const populator = new TypeormPopulate({
		dataSource,
		factories,
	});

	try {
		await populator.initialize();

	} catch (error) {
		console.error(error);
	} finally {
		await populator.destroy();
	}
})();
`;

async function promptForPath() {
  return inquirer.createPromptModule()({
    type: "input",
    name: "directory",
    message:
      "Where do you want to create the `database` folder? (default: src/database)",
    default: "src/database",
  });
}

async function main() {
  const { directory } = await promptForPath();
  const srcDbDir = path.resolve(projectRoot, directory);

  const seedFilePath = path.join(srcDbDir, "seed.ts");

  try {
    if (fs.existsSync(seedFilePath)) {
      console.log(`The file ${seedFilePath} already exists.`);
    } else {
      if (!fs.existsSync(srcDbDir)) {
        fs.mkdirSync(srcDbDir, { recursive: true });
        console.log(`Created directory: ${srcDbDir}`);
      }

      fs.writeFileSync(
        path.join(srcDbDir, "factories.ts"),
        factoriesContent.trim()
      );
      console.log(`File ${path.join(directory, "factories.ts")} created.`);

      fs.writeFileSync(path.join(srcDbDir, "seed.ts"), seedContent.trim());
      console.log(`File ${path.join(directory, "seed.ts")} created.`);
    }
  } catch (error) {
    console.error(error);
  }
}

main().catch(console.error);

module.exports = main;
