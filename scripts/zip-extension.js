import { createWriteStream } from 'fs';
import { readdir, stat } from 'fs/promises';
import { join, relative } from 'path';
import archiver from 'archiver';

const outputFile = 'scrapeflow-v1.0.0.zip';
const sourceDir = 'dist';

async function zipDirectory(source, out) {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', err => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
}

zipDirectory(sourceDir, outputFile)
  .then(() => console.log(`Created ${outputFile}`))
  .catch(err => console.error('Error:', err));
