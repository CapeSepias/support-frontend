const fs = require('fs');
const { exec } = require('child_process');

const tscCmd = 'yarn tsc';
const errorFileName = 'typescript-errors.json';

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

      const errorInstance = {
        path: errorPath,
        message: errorMessage,
      }

      const errorInstances = accumulator[errorCode] ? [...accumulator[errorCode], errorInstance] : [errorInstance];

      return {
        ...accumulator,
        [errorCode]: errorInstances
      };
    }

    return accumulator;
  }, {});

  fs.writeFileSync(errorFileName, JSON.stringify(typescriptErrors, null, 4));

  let totalErrorCount = Object.keys(typescriptErrors).reduce((accumulator, errorCode) => {
    return accumulator + typescriptErrors[errorCode].length
  }, 0)

  console.log(`${totalErrorCount} Typescript errors have been logged and saved in ${errorFileName}.`);

  const topErrors = Object.keys(typescriptErrors).filter(errorCode => typescriptErrors[errorCode].length >= 50).map(errorCode => ({
    errorCode,
    count: typescriptErrors[errorCode].length,
  })).sort((err1, err2) => {
    if (err1.count < err2.count) {
      return 1;
    }

    if (err1.count > err2.count) {
      return -1;
    }

    // count is equal
    return 0;
  });

  console.log('Errors with over 50 instances:');

  topErrors.forEach((error) => {
    console.log(`${error.errorCode} (count: ${error.count})`);
  });

  const filesWithErrors = Object.keys(typescriptErrors).map(errorCode => {
    return typescriptErrors[errorCode].map(errorInstance => errorInstance.path);
  }).flat();

  [...new Set(filesWithErrors)].forEach(filePath => {
    console.log(`"./${filePath}",`)
  });
});
