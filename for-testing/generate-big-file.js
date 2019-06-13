const readline = require('readline');
const fileSystem = require('fs');
const chalk = require('chalk');
const events = require('events');
const constants = require('../app/constants');

class FileCreator {

    constructor(iterations) {
        this.__reader = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.iterations = iterations;
    }

    createBigFile() {
        return new Promise(async resolve => {
            const filename = await this.__readFilename();
            const finishEvent = new events.EventEmitter();

            console.log(chalk.yellow('Starting file creation...'));
            this.__runDataTransfer(filename, finishEvent);
            finishEvent.on('finish', () => {
                console.log(chalk.green(`File ${filename}.csv was created successfully!`));
                resolve();
            });
        })
    }

    __readFilename() {
        return new Promise(resolve => {
            this.__reader.question('Input name of the big file :  ', (filename) => {
                if (fileSystem.existsSync(`${__dirname}\\${filename}.csv`)) {
                    console.log(chalk.red(`File ${filename}.csv is already exists!`));
                    this.__readFilename();
                } else {
                    this.__reader.close();
                    resolve(filename);
                }
            });
        })
    }

    __runDataTransfer(filename, finishEvent) {
        const source = fileSystem.createReadStream(`${__dirname}\\test.csv`);
        const target = fileSystem.createWriteStream(`${__dirname}\\${filename}.csv`, {flags: 'a'});
    
        source.pipe(target);
        source.on('close', () => {
            if (this.iterations === 0) {
                finishEvent.emit('finish');
            } else {
                this.iterations--;
                target.close();
                this.__runDataTransfer(filename, finishEvent);
            }
        });
    }
}

const fileCreator = new FileCreator(constants.generateTest.numberOfIteration);
fileCreator.createBigFile();
