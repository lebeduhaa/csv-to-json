#!/usr/bin/env node
const args = process.argv.slice(2);
const constants = require('./app-constants');
const fileSystem = require('fs');
const chalk = require('chalk');
const { Transform } = require('stream');

const transform = (chunk, encoding, callback) => {
  const currentPieces = (firstLineEnd ? chunk.toString().substr(firstLineEnd + 1) : chunk.toString()).split('\r\n');

  currentPieces.forEach(piece => {
    const obj = {};
    const values = piece.split(',');

    structureKeys.forEach((key, index) => {
      obj[key] = values[index];
    });
    this.push(`${firstLineEnd ? '' : ','}\r\n${JSON.stringify(obj)}`);
    firstLineEnd = null;
  });
  callback();
}

if (constants.requiredArgs.every(argument => args.includes(argument))) {
  const sourceFileArgIndex = args.findIndex(argument => argument === constants.requiredArgs[0]);
  const resultFileArgIndex = args.findIndex(argument => argument === constants.requiredArgs[1]);

  if (
    constants.argValiIndexes.includes(sourceFileArgIndex) &&
    constants.argValiIndexes.includes(resultFileArgIndex) &&
    args.length >= constants.minLengthOfArguments
  ) {
    const sourceFile = args[sourceFileArgIndex + 1];
    const resultFile = args[resultFileArgIndex + 1];

    if (fileSystem.existsSync(resultFile)) {
      console.log(chalk.red(`File ${resultFile} is already exists!`));
    } else {
      const srcStream = fileSystem.createReadStream(sourceFile);
      const distStream = fileSystem.createWriteStream(resultFile);
      const transformStream = new Transform({transform});
      let structureKeys;
      let firstLineEnd;

      distStream.write('[');
      srcStream.on('error', err => console.log(chalk.red(`File ${sourceFile} is not exists!`)));
      srcStream.on('data', data => {
        firstLineEnd = data.toString().indexOf('\n');
        
        if (~firstLineEnd) {
          structureKeys = data.toString().substr(0, firstLineEnd - 1).split(',');
          srcStream.close();
        }
      });
      srcStream.on('close', () => {
        const mainStream = fileSystem.createReadStream(sourceFile).pipe(transformStream).pipe(distStream);

        mainStream.on('finish', () => fileSystem.createWriteStream(resultFile, {flags: 'a'}).write(']'));
      });
    }
  } else {
    console.log(chalk.red('Incorrect syntax of the command!'));
  }
} else {
  console.log(chalk.red('Missing required arguments!'));
}
