#!/usr/bin/env node
const args = process.argv.slice(2);
const fileSystem = require('fs');
const chalk = require('chalk');
const constants = require('./app/constants');
const CsvToJson = require('./app/csv-to-json');
const SeparatorDetector = require('./app/separator');

if (constants.args.required.every(argument => args.includes(argument))) {
    const sourceFileArgIndex = args.findIndex(argument => argument === constants.args.required[0]);
    const resultFileArgIndex = args.findIndex(argument => argument === constants.args.required[1]);

    if (
        constants.args.validIndexes.includes(sourceFileArgIndex)
        && constants.args.validIndexes.includes(resultFileArgIndex)
        && args.length >= constants.args.minLength
    ) {
        const sourceFile = args[sourceFileArgIndex + 1];
        const resultFile = args[resultFileArgIndex + 1];

        if (fileSystem.existsSync(resultFile)) {
            console.log(chalk.red(`File ${resultFile} is already exists!`));
        } else {
            const csvToJson = new CsvToJson(sourceFile, resultFile, new SeparatorDetector());

            csvToJson.run();
        }
    } else {
        console.log(chalk.red('Incorrect syntax of the command!'));
    }
} else {
    console.log(chalk.red('Missing required arguments!'));
}
