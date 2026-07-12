import React from 'react';
import { Eye, Download } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { ResourceCard } from '../resources/ResourceCard';
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
        ]}
        activeSort={noteSort}
        onSortChange={(id) => setNoteSort(id as any)}
        viewMode={noteViewMode}
        onViewModeChange={setNoteViewMode}
      />

      {filteredNotes.length === 0 ? (
        <EmptyState label="No study notes match your search or subject filter." />
      ) : (
        <div className={`grid gap-[24px] ${noteViewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {filteredNotes.map((note) => (
            <ResourceCard
              key={note.id}
              title={note.title}
              description={note.description}
              chapter={note.chapter}
              subject={note.subject}
              actions={[
                {
                  icon: Eye,
                  label: 'View',
                  onClick: () => setActivePdfViewer({ title: note.title, fileUrl: note.fileUrl })
                },
                {
                  icon: Download,
                  label: 'Download',
                  onClick: () => handleDownloadFile(note.id, note.fileUrl)
                }
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
