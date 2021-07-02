const { exec } = require('child_process');

const tscCmd = 'yarn lint:check';
const errorFileName = 'lint-errors.json';

console.log(`Executing ${tscCmd}.`);

exec(tscCmd, (error, stdout) => {
  if (error && error.code && error.code !== 1) {
    console.error(`exec error: ${error}`);
    return;
  }

  const lines = stdout.split(/(\r?\n)/g);

  const lintErrors = lines.reduce((accumulator, line) => {
    const trimmedLine = line.trim();
    const capturedGroups = (/(?<lineNumber>[\d]:[\d]+)/gm.exec(trimmedLine));

    if (capturedGroups && capturedGroups.groups && capturedGroups.groups.lineNumber) {
      const errorId = trimmedLine.split(' ').pop();

      return {
        ...accumulator,
        [errorId]: accumulator[errorId] ? accumulator[errorId] += 1 : 1,
      };
    }

    return {
      ...accumulator,
    };
  }, {});


  console.log(lintErrors);
});
