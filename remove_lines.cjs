const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/components/StudentDashboard.tsx');
const lines = fs.readFileSync(file, 'utf8').split('\n');
const newLines = [...lines.slice(0, 640), ...lines.slice(1301)];
fs.writeFileSync(file, newLines.join('\n'));
console.log('Removed stale lines');
