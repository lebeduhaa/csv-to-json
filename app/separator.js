const args = process.argv.slice(2);
const constants = require('../app/constants');

const getSeparator = (data) => {
  if (args.length > constants.args.minLengthOfArguments) {
      if (!args.includes(constants.args.optionalArgs.separator)) {
          console.log(chalk.red('Incorrect syntax of the command!'));
          process.exit(1);
      } else {
          return args[args.findIndex(argument => argument === constants.args.optionalArgs.separator) + 1];
      }
  } else {
      return detectSeparator(data);
  }
};

const detectSeparator = (data) => {
  let maxSeparator = {
      separator: constants.potentialSeparators[0],
      value: 0
  };

  constants.potentialSeparators.forEach((potentialSeparator) => {  
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

exports.getSeparator = getSeparator;