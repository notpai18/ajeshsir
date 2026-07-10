const fs = require('fs');
const path = require('path');

const p = (...parts) => path.join('c:', 'Users', 'ASUS', '.gemini', 'antigravity-ide', 'scratch', 'ajeshsir', 'src', 'components', ...parts);

function fixEmptyState(filename) {
  let file = p('professor', filename);
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/import \{ EmptyState \} from '\.\.\/ui\/EmptyState';/, '');
  content = content.replace(/import \{ ResourceSection, Toolbar, Table, RowActions \} from '\.\/ui';/, "import { ResourceSection, Toolbar, Table, RowActions, ProfEmptyState } from './ui';");
  content = content.replace(/<EmptyState/g, '<ProfEmptyState');
  fs.writeFileSync(file, content);
}

['NotesSection.tsx', 'VideosSection.tsx', 'PYQSection.tsx', 'SheetsSection.tsx', 'AnnouncementsSection.tsx'].forEach(fixEmptyState);

// Fix DoubtsSection
let doubtsFile = p('professor', 'DoubtsSection.tsx');
let doubtsContent = fs.readFileSync(doubtsFile, 'utf8');
doubtsContent = doubtsContent.replace(/import \{ EmptyState \} from '\.\.\/ui\/EmptyState';/, '');
doubtsContent = doubtsContent.replace(/import \{ PRIMARY_BTN, INPUT, ROW_BTN_DANGER \} from '\.\.\/ui\/tokens';/, "import { PRIMARY_BTN, INPUT, ROW_BTN_DANGER } from '../ui/tokens';\nimport { ProfEmptyState } from './ui';");
doubtsContent = doubtsContent.replace(/<EmptyState/g, '<ProfEmptyState');
doubtsContent = doubtsContent.replace(/import \{ AnswerDoubtModal \} from '\.\/doubts\/AnswerDoubtModal';/, "import { AnswerDoubtModal } from '../doubts/AnswerDoubtModal';");
fs.writeFileSync(doubtsFile, doubtsContent);

// Fix ProfessorDashboard.tsx
let profFile = p('ProfessorDashboard.tsx');
let profContent = fs.readFileSync(profFile, 'utf8');
profContent = profContent.replace(/const goAnswer = \([^\}]+\};/, '');
profContent = profContent.replace(/const handleReplySubmit = \([^\}]+\};/, '');
profContent = profContent.replace(/\/\* ---------------- Helpers ---------------- \*\//, "/* ---------------- Helpers ---------------- */\n  const pendingDoubtsCount = doubts.filter((d) => !d.isAnswered).length;");

fs.writeFileSync(profFile, profContent);
console.log('Fixed compilation errors');
