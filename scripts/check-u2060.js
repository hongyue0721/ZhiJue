const fs = require('fs');
const path = '/app/.next/server/app/api/sessions/route.js';

try {
  const d = fs.readFileSync(path);
  let count = 0;
  const positions = [];
  for (let i = 0; i < d.length - 2; i++) {
    if (d[i] === 0xe2 && d[i+1] === 0x81 && d[i+2] === 0xa0) {
      count++;
      positions.push(i);
    }
  }
  console.log('U+2060 count:', count);
  if (positions.length > 0) {
    console.log('Positions:', positions.slice(0, 10).join(', '));
    // Show context around first occurrence
    const pos = positions[0];
    const start = Math.max(0, pos - 20);
    const end = Math.min(d.length, pos + 20);
    console.log('Context:', d.slice(start, end).toString('utf8'));
  }
} catch(e) {
  console.error('Error:', e.message);
}
