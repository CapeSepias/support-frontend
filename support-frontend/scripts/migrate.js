const glob = require('glob');
const { exec } = require('child_process');

// copy assets to new folder called typescript and run this script

glob('../typescript/**/*.{js,jsx}', (err, files) => {
  if (err) {
    console.log(err.message);
  } else {
    files.reduce((accumulatorPromise, filePath) => accumulatorPromise.then(() =>
      new Promise((resolve) => {
        exec(`flow-to-ts --write --delete-source ${filePath} `, (error) => {
          if (error) {
            console.log(`Failed to migrate ${filePath}: ${error.message}`);
            return;
          }

          console.log(`Successfully migrated ${filePath}`);

          resolve();
        });
      })), Promise.resolve());
  }
});
