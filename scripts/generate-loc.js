import chalk from 'chalk';
import fs from 'fs';
import ora from 'ora';
import path from 'path';
import { getFiles, toSecond } from './utils.js';

// Modify this with your host location.
const BASE_URL = 'https://trackmania-indonesia.github.io/signpacks';

/**
 * Run the program.
 *
 * @param {string} baseUrl The base URL of the host.
 */
async function main(baseUrl) {
  const start = process.hrtime();
  const spinner = ora(`${chalk.yellowBright('Generating new .loc files...')}`).start();

  getFiles(path.resolve(process.cwd(), 'public')).then(files => {
    const parsedFiles = files.map(path.parse).filter(file => file.ext !== '.loc');

    parsedFiles.forEach(file => {
      const relativePath = path
        .relative(process.cwd(), path.resolve(file.dir, file.base))
        .split('\\')
        .join('/');

      fs.writeFileSync(
        path.resolve(file.dir, `${file.base}.loc`),
        relativePath.replace('public/', `${baseUrl}/`)
      );
    });

    const end = `${toSecond(process.hrtime(start))} seconds`;
    spinner.succeed(`Done in ${chalk.greenBright(end)}`);
  });
}

main(BASE_URL).catch(err => {
  console.error(err);
});
