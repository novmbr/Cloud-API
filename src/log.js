const chalk = require("chalk");

function info(x) {
  console.log(chalk.blue("[ℹ]") + " " + x);
}

function danger(x) {
  console.log(chalk.red("[👎]") + " " + chalk.red(x));
}

function warning(x) {
  cconsole.log(chalk.yellow("[⚠]") + " " + chalk.yellow(x));
}

function good(x) {
  console.log(chalk.green("[👍]") + " " + chalk.green(x));
}

module.exports = {
  info: info,
  danger: danger,
  warning: warning,
  good: good,
};
