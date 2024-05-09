/* eslint-disable no-console */

const fs = require('fs');
const { execSync } = require('child_process');

const commands = ['yarn prepare:db-schema-generator'];

if (process.platform === 'win32') {
  console.log('Windows detected, assembling related commands/scripts.');
} else {
  console.log('A *nix OS detected, assembling related commands/scripts.');

  // Check if the .husky directory exists
  if (fs.existsSync('.husky')) {
    commands.push('chmod ug+x .husky/*');
  }

  // Check if .sh files exist in root directory
  const filesInCurrentDir = fs.readdirSync('./');
  const shFiles = filesInCurrentDir.filter((file) => file.endsWith('.sh'));

  if (shFiles.length > 0) {
    commands.push('chmod ug+x ./*.sh');
  }

  if (commands.length === 0) {
    console.log('No commands to run, exiting.');
    return;
  }
}

console.log(`Commands to run: ${JSON.stringify(commands)}`);

try {
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];
    const output = execSync(command).toString();
    console.log(
      `Post-install script command (${command}) executed successfully.`,
      output
    );
  }

  console.log(`Post-install script executed successfully.`);
} catch (error) {
  console.error(`Post-install script failed to execute.`, error);
  throw error;
}
