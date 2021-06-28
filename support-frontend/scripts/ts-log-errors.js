const fs = require('fs');
const { exec } = require('child_process');

const tscCmd = 'yarn tsc';
const errorFileName = 'typescript-errors.json';

let currentError = {};

const updateTypescriptErrors = (typescriptErrors) => {
  const { errorPath, errorCode, errorMessage } = currentError;

  if (!errorPath || !errorCode || !errorMessage) {
    return typescriptErrors;
  }

  if (!typescriptErrors[errorCode]) {
    // eslint-disable-next-line
    typescriptErrors[errorCode] = {
      count: 0,
      instances: [],
    };
  }

  // eslint-disable-next-line
  typescriptErrors[errorCode].count += 1;

  typescriptErrors[errorCode].instances.push({
    path: errorPath,
    message: errorMessage,
  });

  return {
    ...typescriptErrors,
  };
};

console.log(`Executing ${tscCmd}.`);

exec(tscCmd, (error, stdout) => {
  if (error && error.code && error.code !== 1) {
    console.error(`exec error: ${error}`);
    return;
  }

  const lines = stdout.split(/(\r?\n)/g);

  const typescriptErrors = lines.reduce((accumulator, line) => {
    const capturedGroups = (/^(?<errorPath>[^(]*(\.tsx|\.ts)).*?(?<errorCode>TS\d+):\s(?<errorMessage>.*)$/gm.exec(line));

    if (capturedGroups && capturedGroups.groups) {
      const { errorPath, errorCode, errorMessage } = capturedGroups.groups;

      currentError = {
        errorPath,
        errorCode,
        errorMessage,
      };
    } else {
      currentError = {
        ...currentError,
        errorMessage: line.trim(),
      };
    }

    return updateTypescriptErrors(accumulator);
  }, {});

  fs.writeFileSync(errorFileName, JSON.stringify(typescriptErrors, null, 4));

  console.log(`Typescript errors have been logged and saved in ${errorFileName}.`);
});
