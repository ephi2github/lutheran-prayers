const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/source/prayers_am.json');

const id = process.argv[2];
const newText = process.argv[3];
const newTextAm = process.argv[4];

if (!id || !newText || !newTextAm) {
  console.error('Usage: node update_prayer.js <id> <new_text> <new_text_am>');
  process.exit(1);
}

try {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const index = data.prayers.findIndex(p => p.id === id);

  if (index === -1) {
    console.error(`Prayer with ID ${id} not found.`);
    process.exit(1);
  }

  data.prayers[index].text = newText;
  data.prayers[index].text_am = newTextAm;
  // Update generated_at
  data.meta.generated_at = new Date().toISOString();

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Successfully updated prayer ${id}`);
} catch (error) {
  console.error('Error updating prayer:', error.message);
  process.exit(1);
}
