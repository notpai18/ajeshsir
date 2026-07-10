const fs = require('fs');
const path = require('path');

const file = path.join('c:', 'Users', 'ASUS', '.gemini', 'antigravity-ide', 'scratch', 'ajeshsir', 'src', 'components', 'ProfessorDashboard.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Add imports at the top
const imports = `import { OverviewSection } from './professor/OverviewSection';
import { NotesSection } from './professor/NotesSection';
import { VideosSection } from './professor/VideosSection';
import { PYQSection } from './professor/PYQSection';
import { SheetsSection } from './professor/SheetsSection';
import { DoubtsSection } from './professor/DoubtsSection';
import { AnnouncementsSection } from './professor/AnnouncementsSection';\n`;

content = content.replace(/import \{ uploadFile \}/, imports + 'import { uploadFile }');

// 2. Remove states and derived data that moved to sections
content = content.replace(/  \/\/ Doubts inbox[\s\S]*?const setFilter = [^\n]*\n/, '');

content = content.replace(/  \/\* ---------------- Derived data ---------------- \*\/[\s\S]*?\/\* ---------------- Helpers ---------------- \*\//, '/* ---------------- Helpers ---------------- */');

// 3. Replace the return statement sections
const startOverview = content.indexOf("{/* ---------- OVERVIEW ---------- */}");
const endSettings = content.indexOf("{/* ---------- SETTINGS ---------- */}");

if (startOverview !== -1 && endSettings !== -1) {
  const replacement = `
            {/* ---------- OVERVIEW ---------- */}
            {activeTab === 'overview' && (
              <OverviewSection 
                exams={exams} notes={notes} videos={videos} pyqs={pyqs} practiceSheets={practiceSheets} doubts={doubts}
                onNavigateToDoubt={(id) => { setActiveTab('doubts'); }} 
              />
            )}

            {/* ---------- NOTES ---------- */}
            {activeTab === 'notes' && (
              <NotesSection 
                exams={exams} notes={notes}
                openAddNote={openAddNote} openEditNote={openEditNote} askDelete={askDelete} onDeleteNote={onDeleteNote}
                openPDF={openPDF} setPdfDoc={setPdfDoc}
              />
            )}

            {/* ---------- VIDEOS ---------- */}
            {activeTab === 'videos' && (
              <VideosSection 
                exams={exams} videos={videos}
                openAddVideo={openAddVideo} openEditVideo={openEditVideo} askDelete={askDelete} onDeleteVideo={onDeleteVideo}
              />
            )}

            {/* ---------- PYQS ---------- */}
            {activeTab === 'pyqs' && (
              <PYQSection 
                exams={exams} pyqs={pyqs}
                openAddPyq={openAddPyq} openEditPyq={openEditPyq} askDelete={askDelete} onDeletePyq={onDeletePyq}
                openPDF={openPDF} setPdfDoc={setPdfDoc}
              />
            )}

            {/* ---------- SHEETS ---------- */}
            {activeTab === 'sheets' && (
              <SheetsSection 
                exams={exams} practiceSheets={practiceSheets}
                openAddSheet={openAddSheet} openEditSheet={openEditSheet} askDelete={askDelete} onDeletePracticeSheet={onDeletePracticeSheet}
                openPDF={openPDF} setPdfDoc={setPdfDoc}
              />
            )}

            {/* ---------- DOUBTS ---------- */}
            {activeTab === 'doubts' && (
              <DoubtsSection 
                doubts={doubts}
                askDelete={askDelete} onDeleteDoubt={onDeleteDoubt} onReplyDoubt={onReplyDoubt}
              />
            )}

            {/* ---------- ANNOUNCEMENTS ---------- */}
            {activeTab === 'announcements' && (
              <AnnouncementsSection 
                announcements={announcements}
                openAddAnnouncement={openAddAnnouncement} openEditAnnouncement={openEditAnnouncement}
                onTogglePinAnnouncement={onTogglePinAnnouncement} askDelete={askDelete} onDeleteAnnouncement={onDeleteAnnouncement}
              />
            )}

            `;
  
  content = content.substring(0, startOverview) + replacement + content.substring(endSettings);
}

// 4. Remove UI scaffolding from the bottom
const startScaffold = content.indexOf("/* ------------------------------------------------------------------ *\n * Section scaffolding");
if (startScaffold !== -1) {
  content = content.substring(0, startScaffold);
}

fs.writeFileSync(file, content);
console.log("Refactoring complete");
