#!/usr/bin/env node
const args = process.argv.slice(2);
const constants = require('./app-constants');
const fileSystem = require('fs');
const chalk = require('chalk');
const { Transform } = require('stream');
const uploadFile = require('./google-drive/google-drive-api').uploadFile;

const getSeparator = data => {
  if (args.length > constants.minLengthOfArguments) {
    if (!args.includes(constants.optionalArgs.separator)) {
      console.log(chalk.red('Incorrect syntax of the command!'));
      process.exit(1);
    } else {
      return args[args.findIndex(argument => argument === constants.optionalArgs.separator) + 1];
    }
  } else {
    let maxSeparator = {
      separator: constants.potentialSeparators[0],
      value: 0
    };

    constants.potentialSeparators.forEach(potentialSeparator => {  
      let count = 0;
    
      for (let i = 0; i < data.length; i++) {
        if (data[i] === potentialSeparator && data[i - 1] !== potentialSeparator) {
          count++;
        }
      }

      if (count > maxSeparator.value) {
        maxSeparator = {
          separator: potentialSeparator,
          value: count
        };
      }
    });

    return maxSeparator.separator;
  }
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
      let distStream;
      let nextLineSeparator;
      let separator;
      const transformStream = new Transform({
        transform(chunk, encoding, callback) {
          const currentPieces = (firstLineEnd ? chunk.toString().substr(firstLineEnd + 1) : chunk.toString()).split(nextLineSeparator);
          
          currentPieces.forEach(piece => {
            const obj = {};
            const values = piece.split(separator);
        
            structureKeys.forEach((key, index) => {
              obj[key] = values[index];
            });
            this.push(`${firstLineEnd ? '' : ','}\r\n${JSON.stringify(obj)}`);
            firstLineEnd = null;
          });
          callback();
        }
      });
      let structureKeys;
      let firstLineEnd;

      srcStream.on('error', err => console.log(chalk.red(`File ${sourceFile} is not exists!`)));
      srcStream.on('data', data => {
        separator = getSeparator(data.toString());
        distStream = fileSystem.createWriteStream(resultFile);
        distStream.write('[');
        console.log(chalk.green('The process have started...'));

        if (~data.toString().indexOf('\r')) {
          nextLineSeparator = '\r';
        } else {
          nextLineSeparator = '\n';
        }

        firstLineEnd = data.toString().indexOf(nextLineSeparator);

        if (~firstLineEnd) {
          structureKeys = data.toString().substr(0, firstLineEnd - 1).split(separator);
          srcStream.close();
        }
      });
      srcStream.on('close', () => {
        const mainStream = fileSystem.createReadStream(sourceFile).pipe(transformStream).pipe(distStream);

        mainStream.on('finish', () => {
          fileSystem.createWriteStream(resultFile, {flags: 'a'}).write(']');
          console.log(chalk.green('Converting was performed successfully!'));
          uploadFile(resultFile);
        });
      });
    }
  } else {
    console.log(chalk.red('Incorrect syntax of the command!'));
  }
} else {
  console.log(chalk.red('Missing required arguments!'));
}
