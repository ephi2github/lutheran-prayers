const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/source/prayers_am.json');
const batchSize = parseInt(process.argv[2]) || 5;

try {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const batch = [];

  for (const prayer of data.prayers) {
    if (prayer.text_am && prayer.text_am.endsWith('...')) {
      batch.push({
        id: prayer.id,
        title: prayer.title,
        text: prayer.text,
        text_am_partial: prayer.text_am
      });
      if (batch.length >= batchSize) break;
    }
  }

  console.log(JSON.stringify(batch, null, 2));
} catch (error) {
  console.error('Error reading prayers:', error.message);
  process.exit(1);
}
