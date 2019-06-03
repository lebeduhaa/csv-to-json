const readline = require('readline');
const fileSystem = require('fs');
const chalk = require('chalk');
const events = require('events');
const constants = require('../app/constants');
const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let numberOfCopyPasting = 0;
const finishEvent = new events.EventEmitter();

const runDataTransfer = (filename) => {
    const source = fileSystem.createReadStream(`${__dirname}\\test.csv`);
    const dist = fileSystem.createWriteStream(`${__dirname}\\${filename}.csv`, {flags: 'a'});

    source.pipe(dist);
    source.on('close', () => {
        if (numberOfCopyPasting === constants.generateTest.numberOfIteration) {
            finishEvent.emit('finish');
        } else {
            numberOfCopyPasting++;
            runDataTransfer(filename);
            dist.close();
        }
    });
};

const createBigFile = async filename => new Promise((resolve) => {
    runDataTransfer(filename);
    finishEvent.on('finish', () => resolve());
});

const readFileName = () => {
    reader.question('Input name of the big file :  ', async (filename) => {
        if (fileSystem.existsSync(`${__dirname}\\${filename}.csv`)) {
            console.log(chalk.red(`File ${filename}.csv is already exists!`));
            readFileName();
        } else {
            reader.close();
            console.log(chalk.yellow('Starting file creation...'));
            await createBigFile(filename);
            console.log(chalk.green(`File ${filename}.csv was created successfully!`));
        }
    });
};

readFileName();
