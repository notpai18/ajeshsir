import fs from 'fs';
import { execSync } from 'child_process';

// Add the custom variant to index.css
const indexCssPath = 'src/index.css';
let content = fs.readFileSync(indexCssPath, 'utf8');

if (!content.includes('@custom-variant hover')) {
  content = content.replace('@import "tailwindcss";', '@import "tailwindcss";\n@custom-variant hover (@media (hover: hover) and (pointer: fine) { &:hover });');
  fs.writeFileSync(indexCssPath, content);
  console.log('Added custom variant to index.css');
} else {
  console.log('Variant already exists');
}

// Compile tailwind
try {
  execSync('npx tailwindcss -i ./src/index.css -o ./test-out.css', { stdio: 'inherit' });
  
  // Check the output
  const out = fs.readFileSync('./test-out.css', 'utf8');
  if (out.includes('@media (hover: hover)')) {
    console.log('Success! hover overridden.');
  } else {
    console.log('Failed to override hover.');
  }
} catch(e) {
  console.error(e.message);
}
