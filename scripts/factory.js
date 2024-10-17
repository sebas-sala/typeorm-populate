const inquirer = require("inquirer");
const fs = require("node:fs");
const path = require("node:path");
const projectRoot = process.cwd();
const { isValidInput } = require("../src/utils/formatters");

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

      return true;
    },
  });
}

async function promptForPath() {
  return inquirer.createPromptModule()({
    type: "input",
    name: "directory",
    message:
      "Where do you want to create the `database` folder? (default: src/database)",
    default: "src/database",
  });
}

function fileContent(factoryName) {
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

  if (fs.existsSync(factoryFilePath)) {
    console.log(`The file ${factoryFilePath} already exists.`);
    return;
  }

  if (!fs.existsSync(srcDbDir)) {
    fs.mkdirSync(srcDbDir, { recursive: true });
    console.log(`Created directory: ${srcDbDir}`);
  }

  const factoryName = `${factoryInput[0].toUpperCase()}${factoryInput.slice(
    1
  )}Factory`;

  fs.writeFileSync(factoryFilePath, fileContent(factoryName).trim());
}

module.exports = main;
