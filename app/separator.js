const args = process.argv.slice(2);
const constants = require('../app/constants');

class SeparatorDetector {

    static getSeparator(line) {
        if (args.length > constants.args.minLength) {
            if (!args.includes(constants.args.optional.separator)) {
                console.log(chalk.red('Incorrect syntax of the command!'));
                process.exit(1);
            } else {
                return args[args.findIndex(argument => argument === constants.args.optional.separator) + 1];
            }
        } else {
            return this.__detectSeparator(line);
        }
    }

    static __detectSeparator(line) {
        let maxSeparator = {
            separator: constants.potentialSeparators[0],
            value: 0
        };
      
        constants.potentialSeparators.forEach((potentialSeparator) => {  
            let count = 0;
      
            for (let i = 0; i < line.length; i++) {
                if (line[i] === potentialSeparator && line[i - 1] !== potentialSeparator) {
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

    static getNextLineSeparator(line) {
        if (~line.toString().indexOf('\r')) {
            return '\r';
        } else {
            return '\n';
        }
    }
}

module.exports = SeparatorDetector;