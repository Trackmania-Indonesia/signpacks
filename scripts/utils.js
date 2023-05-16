import fs from 'fs/promises';
import path from 'path';

/**
 * Get current time in seconds, formatted to 3 numbers behind commas precision
 *
 * @param {[number, number]} hrtime High resolution time, should be
 * `process.hrtime()`
 * @returns {string} time string, in seconds.
 */
export function toSecond(hrtime) {
  return (hrtime[0] + hrtime[1] / 1e9).toFixed(3);
}

/**
 * Recursively search for files in a directory.
 *
 * @async
 * @function getFiles
 * @param {string} dir The directory to search.
 * @returns {Promise<string[]>} An array of pathnames to all discovered files.
 */
export async function getFiles(dir) {
  const subdirs = await fs.readdir(dir);
  const files = await Promise.all(
    subdirs.map(async subdir => {
      const res = path.resolve(dir, subdir);
      return (await fs.stat(res)).isDirectory() ? getFiles(res) : res;
    })
  );
  return files.reduce((a, f) => a.concat(f), []);
}
