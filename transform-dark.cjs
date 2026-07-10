const fs = require('fs');
const path = require('path');

const colorMap = {
  // Backgrounds
  'bg-white': 'dark:bg-[#22201F]',
  'bg-[#F6F2EA]': 'dark:bg-[#1A1817]',
  'bg-[#F5F5F7]': 'dark:bg-[#151413]',
  'bg-[#FBF7F0]': 'dark:bg-[#2A2725]',
  'bg-[#EAE1D2]': 'dark:bg-[#383330]',
  'bg-[#F4E7E5]': 'dark:bg-[#380A14]',
  'bg-[#F7EFD9]': 'dark:bg-[#362A0D]',
  
  // Text
  'text-[#22201F]': 'dark:text-[#F6F2EA]',
  'text-[#5A534B]': 'dark:text-[#A89F91]',
  'text-[#8A7E6F]': 'dark:text-[#A89F91]',
  'text-[#4A0E1B]': 'dark:text-[#F4E7E5]',
  'text-[#8A6A16]': 'dark:text-[#E8CD82]',
  'text-[#C0A98B]': 'dark:text-[#A89F91]',
  
  // Borders
  'border-[#EAE1D2]': 'dark:border-[#383330]',
  'border-[#F2ECDF]': 'dark:border-[#2A2725]',
  'border-[#EFE7D8]': 'dark:border-[#332E2C]',
  
  // Hover Backgrounds
  'hover:bg-[#FBF7F0]': 'dark:hover:bg-[#2A2725]',
  'hover:bg-[#F7EFD9]': 'dark:hover:bg-[#362A0D]',
  'hover:bg-[#F4E7E5]': 'dark:hover:bg-[#380A14]',
  'group-hover:bg-[#F7EFD9]': 'dark:group-hover:bg-[#362A0D]',
  'group-hover:bg-[#4A0E1B]': 'dark:group-hover:bg-[#5C1122]',
  'hover:bg-[#4A0E1B]': 'dark:hover:bg-[#5C1122]',
  
  // Hover Text
  'hover:text-[#4A0E1B]': 'dark:hover:text-[#F4E7E5]',
  'group-hover:text-[#4A0E1B]': 'dark:group-hover:text-[#F4E7E5]',
  'group-hover:text-[#8A6A16]': 'dark:group-hover:text-[#E8CD82]',
  
  // Hover Borders
  'hover:border-[#EAE1D2]': 'dark:hover:border-[#4A433E]',
  'hover:border-[#D9C2A2]': 'dark:hover:border-[#6B6158]',
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Split content by spaces and quotes/backticks to safely inject classes
  // A safer approach: parse className strings
  const classNameRegex = /className=(?:["']([^"']+)["']|\{`([^`]+)`\})/g;
  
  content = content.replace(classNameRegex, (match, p1, p2) => {
    let classesStr = p1 !== undefined ? p1 : p2;
    let originalClassesStr = classesStr;
    const classes = classesStr.split(/\s+/);
    
    const newClasses = [];
    for (const cls of classes) {
      newClasses.push(cls);
      if (colorMap[cls] && !classes.includes(colorMap[cls])) {
        newClasses.push(colorMap[cls]);
      }
    }
    
    const newClassesStr = newClasses.join(' ');
    if (newClassesStr !== originalClassesStr) {
      changed = true;
      if (p1 !== undefined) return `className="${newClassesStr}"`;
      if (p2 !== undefined) return `className={\`${newClassesStr}\`}`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath);
    } else if (filePath.endsWith('.tsx') && !filePath.includes('AppOriginal') && !filePath.includes('original')) {
      processFile(filePath);
    }
  }
}

walk('./src');
