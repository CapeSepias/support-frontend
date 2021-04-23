const glob = require('glob');
const { exec } = require('child_process');

glob('../assets/**/*.{js,jsx}', (err, files) => {
  if (err) {
    console.log(err.message);
  } else {
    files.forEach((filePath) => {
      exec(`flow-to-ts --write --delete-source ${filePath} `, (error) => {
        if (error) {
          console.log(`Failed to migrate ${filePath}: ${error.message}`);
          return;
        }

        console.log(`Successfully migrated ${filePath}`);
      });
    });
  }
});
