#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "node:fs";
import path from "node:path";
import { isValidInput } from "../src/utils/formatters.js";

const projectRoot = process.cwd();

async function promptForFactoryName() {
  return inquirer.createPromptModule()({
    type: "input",
    name: "factoryName",
    message:
      "Enter the name of the factory/entity (singular): (e.g. user, post, comment)",
    validate: (input) => {
      const formattedInput = input.trim().toLowerCase();

      if (formattedInput === "") {
        return "The input cannot be empty. Please enter a valid name.";
      }

      if (!isValidInput(formattedInput)) {
        return "Invalid input. Please enter a name with only alphabets, no spaces or special characters.";
      }

      const srcDbDir = path.resolve(projectRoot, "src/factories");
      const factoryFilePath = path.join(
        srcDbDir,
        `${formattedInput}.factory.ts`
      );

      if (fs.existsSync(factoryFilePath)) {
        return `The file ${factoryFilePath} already exists.`;
      }

      return true;
    },
  });
}

async function promptForPath() {
  return inquirer.createPromptModule()({
    type: "input",
    name: "directory",
    message:
      "Where do you want to create the `factories` folder? (default: src/factories)",
    default: "src/factories",
  });
}

function factoryFileContent(factoryName) {
  return `
import {Factory} from "typeorm-populate"; 
import type { DataSource, ObjectLiteral } from "typeorm";

// Replace the ObjectLiteral with your entity class
export class ${factoryName} extends Factory<ObjectLiteral> {
  constructor(dataSource: DataSource) {
    // Replace the object with your entity class
    super(dataSource, {});
  }

  // Replace the ObjectLiteral with your entity class
  protected defaultData(): Partial<ObjectLiteral> {
    return {};
  }
}
  `;
}

async function main() {
  const { factoryName: factoryInput } = await promptForFactoryName();
  const { directory } = await promptForPath();

  const srcDbDir = path.resolve(projectRoot, directory);
  const factoryFilePath = path.join(srcDbDir, `${factoryInput}.factory.ts`);
  const factoriesFilePath = path.join(srcDbDir, "/index.ts");

  const changes = [];

  if (!fs.existsSync(srcDbDir)) {
    changes.push(() => fs.mkdirSync(srcDbDir, { recursive: true }));
  }

  const factoryName = `${factoryInput[0].toUpperCase()}${factoryInput.slice(
    1
  )}Factory`;

  const factoryContent = factoryFileContent(factoryName).trim();
  changes.push(() => fs.writeFileSync(factoryFilePath, factoryContent));

  if (fs.existsSync(factoriesFilePath)) {
    let factoriesContent = fs.readFileSync(factoriesFilePath, "utf-8");

    const importStatement = `import { ${factoryName} } from "./${factoryInput}.factory";\n`;
    factoriesContent = importStatement + factoriesContent;

    factoriesContent = factoriesContent.replace(
      /export const factories = \{([^}]*)\}/,
      (match, factories) => {
        const updatedFactories = factories.trim()
          ? `${factories.trim()}, ${factoryName}`
          : factoryName;
        return `export const factories = { ${updatedFactories} };`;
      }
    );

    changes.push(() => fs.writeFileSync(factoriesFilePath, factoriesContent));
  } else {
    const initialFactoriesContent = `import { ${factoryName} } from "./${factoryInput}.factory";\n\nexport const factories = { ${factoryName} };`;
    changes.push(() =>
      fs.writeFileSync(factoriesFilePath, initialFactoriesContent)
    );
  }

  for (const change of changes) {
    change();
  }

  console.log(`Factory ${factoryInput} created successfully.`);
}

export { main as factory };
