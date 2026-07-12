import React from 'react';
import { FileText, Download, Eye } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { PremiumCard } from '../PremiumCard';
import { ResourceHero, ResourceToolbar } from '../resources/ResourcePageLayout';
import type { NotesSectionProps } from './types';

export function NotesSection({
  currentExamInfo,
  selectedExam,
  availableSubjects,
  filteredNotes,
  notes,
  noteViewMode, setNoteViewMode,
  noteSort, setNoteSort,
  searchQuery, setSearchQuery,
  selectedSubject, setSelectedSubject,
  studiedNotes, toggleStudied,
  setActivePdfViewer,
  handleDownloadFile,
}: NotesSectionProps) {
  return (
    <div key={selectedExam} className="animate-[fadeInUp_0.4s_ease-out_forwards]">
      <ResourceHero
        themeGradient={currentExamInfo?.themeGradient || 'from-[#4A0E1B] to-[#7C2532]'}
        title={currentExamInfo?.heroTitle || 'Study Notes'}
        description={currentExamInfo?.heroDescription || 'Access chapter-wise Chemistry notes covering Physical, Organic and Inorganic Chemistry with formula sheets, NCERT concepts and previous year important topics.'}
        quickStats={currentExamInfo?.quickStats}
        totalLabel="Total Notes"
        totalCount={notes.filter(n => n.course === selectedExam).length}
        progressValue={notes.filter(n => n.course === selectedExam && studiedNotes.has(n.id)).length}
        progressLabel="reviewed"
      />

      <ResourceToolbar
        tabs={currentExamInfo?.filters || availableSubjects}
        activeTab={selectedSubject}
        onTabChange={setSelectedSubject}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search notes..."
        sortOptions={[
          { id: 'recent', label: 'Most Recent' },
          { id: 'popular', label: 'Most Downloaded' },
          { id: 'alphabetical', label: 'Alphabetical A-Z' },
          { id: 'size', label: 'File Size' },
        ]}
        activeSort={noteSort}
        onSortChange={(id) => setNoteSort(id as any)}
        viewMode={noteViewMode}
        onViewModeChange={setNoteViewMode}
      />

      {filteredNotes.length === 0 ? (
        <EmptyState label="No study notes match your search or subject filter." />
      ) : (
        <div className={`grid gap-[20px] ${noteViewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredNotes.map((note, idx) => {
            let customStyles = { bg: '#F4E7E5', text: '#4A0E1B' };
            if (note.subject === 'Physical Chemistry' || note.subject === 'Physical') customStyles = { bg: '#FDECEA', text: '#C0392B' };
            else if (note.subject === 'Organic Chemistry' || note.subject === 'Organic') customStyles = { bg: '#EAF4EC', text: '#3C8C5B' };
            else if (note.subject === 'Inorganic Chemistry' || note.subject === 'Inorganic') customStyles = { bg: '#EAF0FB', text: '#3A5FA6' };

            return (
              <PremiumCard key={note.id} interactive padding="medium" className="flex flex-col h-full">
                <div className="flex items-start gap-4">
                  <PremiumCard.Icon className="bg-opacity-20" style={{ backgroundColor: customStyles.bg, color: customStyles.text }}>
                    <FileText size={20} />
                  </PremiumCard.Icon>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="mb-[12px] flex flex-wrap items-center gap-[8px] justify-end absolute top-4 right-4">
                      <span className="inline-flex items-center rounded-full bg-[#F4F4F4] dark:bg-[#383330] px-[10px] py-[4px] text-[11px] font-bold text-[#4A4A4A] dark:text-[#C7BCAD]">
                        {note.chapter}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-[#F4F4F4] dark:bg-[#383330] px-[10px] py-[4px] text-[11px] font-bold text-[#4A4A4A] dark:text-[#C7BCAD] gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: customStyles.text }} />
                        {note.subject}
                      </span>
                    </div>
                    <PremiumCard.Title className="mt-2 text-[15px] pr-20 line-clamp-2">
                      {note.title}
                    </PremiumCard.Title>
                  </div>
                </div>

                <PremiumCard.Description className="mt-[12px] line-clamp-2 text-[13px]">
                  {note.description}
                </PremiumCard.Description>

                <PremiumCard.Footer className="mt-auto">
                  <div className="flex items-center justify-between w-full">
                    <label className="flex items-center gap-2 cursor-pointer group/check">
                      <input
                        type="checkbox"
                        checked={studiedNotes.has(note.id)}
                        onChange={() => toggleStudied(note.id)}
                        className="h-[14px] w-[14px] rounded border-[#C0A98B] text-[#5A2436] focus:ring-[#5A2436]/30 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className={`text-[11px] font-bold uppercase tracking-[0.05em] transition-colors ${studiedNotes.has(note.id) ? 'text-[#5A2436]' : 'text-[#8B8B8B] group-hover/check:text-[#4A4A4A]'}`}>
                        MARK REVIEWED
                      </span>
                    </label>
                    <div className="flex gap-[8px]">
                      <button onClick={(e) => { e.stopPropagation(); setActivePdfViewer({ title: note.title, fileUrl: note.fileUrl }); }} className="flex h-[36px] items-center justify-center rounded-[8px] border border-[#E0D5CC] dark:border-[#383330] bg-white dark:bg-[#22201F] px-[12px] text-[12px] font-bold text-[#5A2436] dark:text-[#F6F2EA] transition-all hover:bg-[#F9F7F5] dark:hover:bg-[#2A2726]">
                        <Eye size={14} className="mr-1.5" /> View
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDownloadFile(note.id, note.fileUrl); }} className="flex h-[36px] items-center justify-center rounded-[8px] bg-[#F3D9CE] dark:bg-[#4A0E1B] px-[12px] text-[12px] font-bold text-[#8A3D2C] dark:text-[#F6F2EA] transition-all hover:bg-[#EBD2C7] dark:hover:bg-[#5A1424]">
                        <Download size={14} className="mr-1.5" /> Download
                      </button>
                    </div>
                  </div>
                </PremiumCard.Footer>
              </PremiumCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
