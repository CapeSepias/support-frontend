const glob = require('glob');
const { exec } = require('child_process');

// copy assets to new folder called typescript and run this script

glob('../assets/helpers/abTests/**/*.{js,jsx}', (err, files) => {
  if (err) {
    console.log(err.message);
  } else {
    const failures = [];

    const result = files.reduce((accumulatorPromise, filePath) => accumulatorPromise.then(() =>
      new Promise((resolve) => {
        exec(`flow-to-ts --write ${filePath} `, (error) => {
          if (error) {
            failures.push(`Failed to migrate ${filePath}: ${error.message}`);
          } else {
            console.log(`Successfully migrated ${filePath}`);
          }

          resolve();
        });
      })), Promise.resolve());

    result.then(() => {
      if (failures.length) {
        failures.forEach((failure) => {
          console.log(failure);
        });
      } else {
        console.log('All files successfully migrated!');
      }
    });
  }
});
