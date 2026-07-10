const fs = require('fs');
const path = require('path');

const p = (...parts) => path.join('c:', 'Users', 'ASUS', '.gemini', 'antigravity-ide', 'scratch', 'ajeshsir', 'src', 'components', ...parts);

// Fix AnnouncementsSection.tsx import
let annFile = p('professor', 'AnnouncementsSection.tsx');
let annContent = fs.readFileSync(annFile, 'utf8');
annContent = annContent.replace(/import \{ PRIMARY_BTN, ROW_BTN, ROW_BTN_DANGER \} from '\.\.\/ui\/tokens';/, "import { PRIMARY_BTN, ROW_BTN, ROW_BTN_DANGER } from '../ui/tokens';\nimport { ProfEmptyState } from './ui';");
fs.writeFileSync(annFile, annContent);

// Fix ProfessorDashboard.tsx
let profFile = p('ProfessorDashboard.tsx');
let profContent = fs.readFileSync(profFile, 'utf8');
// Replace `handleReplySubmit` function block exactly
profContent = profContent.replace(/  const handleReplySubmit = \(id: string\) => \{\s*if \(\!replyText\.trim\(\)\) return;\s*onReplyDoubt\(id, \{ reply_text: replyText \}\);\s*setReplyText\(''\);\s*setReplyingDoubtId\(null\);\s*\};\s*/, '');
fs.writeFileSync(profFile, profContent);

console.log('Fixed additional compilation errors');
