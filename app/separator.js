const args = process.argv.slice(2);
const chalk = require('chalk');
const constants = require('../app/constants');

class SeparatorDetector {
    getSeparator(line) {
        if (args.length > constants.args.minLength) {
            if (!args.includes(constants.args.optional.separator)) {
                console.log(chalk.red('Incorrect syntax of the command!'));
                process.exit(1);
            } else {
                return args[args.findIndex(argument => argument === constants.args.optional.separator) + 1];
            }
        }

        return this._detectSeparator(line);
    }

    _detectSeparator(line) {
        let maxSeparator = {
            separator: constants.potentialSeparators[0],
            value: 0
        };

        constants.potentialSeparators.forEach((potentialSeparator) => {
            let count = 0;

            for (let i = 0; i < line.length; i += 1) {
                if (line[i] === potentialSeparator && line[i - 1] !== potentialSeparator) {
                    count += 1;
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

    getNextLineSeparator(line) {
        if (line.toString()
            .indexOf('\r') !== -1) {
            return '\r';
        }

        return '\n';
    }
}

module.exports = SeparatorDetector;
