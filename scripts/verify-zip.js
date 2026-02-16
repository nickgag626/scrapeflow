import yauzl from 'yauzl';

yauzl.open('scrapeflow-v1.0.0.zip', { lazyEntries: true }, (err, zipfile) => {
  if (err) throw err;
  console.log('Contents of scrapeflow-v1.0.0.zip:');
  console.log('================================');
  
  zipfile.readEntry();
  zipfile.on('entry', (entry) => {
    console.log(entry.fileName);
    zipfile.readEntry();
  });
  
  zipfile.on('end', () => {
    console.log('================================');
    console.log('Extension packaged successfully!');
  });
});
