#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = process.cwd();
const srcDbDir = path.join(projectRoot, "src/database");

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

async function createSeedFiles() {
  if (!fs.existsSync(srcDbDir)) {
    console.log(`The folder ${srcDbDir} doesn't exist.`);
  }

  const seedFilePath = path.join(srcDbDir, "seed.ts");
  console.log(`Checking if the file ${seedFilePath} already exists.`);

  if (fs.existsSync(seedFilePath)) {
    console.log(`The file ${seedFilePath} already exists.`);
  } else {
    if (!fs.existsSync(srcDbDir)) {
      fs.mkdirSync(srcDbDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(srcDbDir, "factories.ts"),
      factoriesContent.trim()
    );
    console.log(`File ${path.join(srcDbDir, "factories.ts")} created.`);

    fs.writeFileSync(path.join(srcDbDir, "seed.ts"), seedContent.trim());
    console.log(`File ${path.join(srcDbDir, "seed.ts")} created.`);

    console.log("Config files created. Now you can run the seed.ts.");
  }
}

createSeedFiles().catch(console.error);
