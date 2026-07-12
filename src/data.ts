/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExamInfo, Note, Video, PYQ, PracticeSheet, Doubt, FAQ, Announcement } from './types';
import { SUBJECTS } from './constants/subjects';

export const EXAMS: ExamInfo[] = [
  {
    id: 'jee-main',
    title: 'JEE Main',
    description: 'Comprehensive resources for JEE Main Physical & Organic Chemistry, including concept sheets and mock drills.',
    icon: 'Atom',
    heroTitle: 'JEE Main Chemistry Notes',
    heroDescription: 'Access chapter-wise Chemistry notes for JEE Main covering Physical, Organic and Inorganic Chemistry with formula sheets, NCERT concepts and previous year important topics.',
    themeGradient: 'from-[#4A0E1B] to-[#2D0810]',
    filters: ['All', 'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'],
    quickStats: [
      { icon: 'BookOpen', value: '145', label: 'Notes' },
      { icon: 'Library', value: '18', label: 'Chapters' },
      { icon: 'FileText', value: '42', label: 'Formula Sheets' },
      { icon: 'Target', value: '650+', label: 'PYQs' }
    ]
  },
  {
    id: 'jee-advanced',
    title: 'JEE Advanced',
    description: 'Advanced-level problem-solving notes, multi-concept derivation guides, and deep-dive lectures.',
    icon: 'FlaskConical',
    heroTitle: 'JEE Advanced Chemistry Notes',
    heroDescription: 'Advanced conceptual notes with derivations, multi-concept problems, mechanisms, shortcut techniques and high-level practice for IIT-JEE Advanced.',
    themeGradient: 'from-[#4A0E1B] to-[#2D0810]',
    filters: ['All', 'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'],
    quickStats: [
      { icon: 'BookOpen', value: '82', label: 'Notes' },
      { icon: 'Library', value: '16', label: 'Chapters' },
      { icon: 'FileText', value: '31', label: 'Formula Sheets' },
      { icon: 'Target', value: '980+', label: 'Advanced Problems' }
    ]
  },
  {
    id: 'neet',
    title: 'NEET Chemistry',
    description: 'Conceptual theory notes, formula sheets, and speed-accuracy practice booklets specialized for medical aspirants.',
    icon: 'Stethoscope',
    heroTitle: 'NEET Chemistry Notes',
    heroDescription: 'NCERT-focused Chemistry notes for NEET with concise theory, important reactions, diagrams, formula sheets and one-liners.',
    themeGradient: 'from-[#4A0E1B] to-[#2D0810]',
    filters: ['All', 'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'],
    quickStats: [
      { icon: 'BookOpen', value: '96', label: 'Notes' },
      { icon: 'Library', value: '15', label: 'Chapters' },
      { icon: 'FileText', value: '35', label: 'NCERT Summaries' },
      { icon: 'Target', value: '520+', label: 'PYQs' }
    ]
  },
  {
    id: 'net',
    title: 'CSIR NET',
    description: 'Postgraduate-level quantum chemistry, thermodynamics, and molecular spectroscopy resources.',
    icon: 'Hexagon',
    heroTitle: 'CSIR NET Chemistry Notes',
    heroDescription: 'Postgraduate Chemistry notes for CSIR NET covering advanced Physical, Organic, Inorganic and Analytical Chemistry.',
    themeGradient: 'from-[#4A0E1B] to-[#2D0810]',
    filters: ['All', 'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Analytical Chemistry'],
    quickStats: [
      { icon: 'BookOpen', value: '58', label: 'Notes' },
      { icon: 'Library', value: '12', label: 'Modules' },
      { icon: 'FileText', value: '24', label: 'Spectroscopy Sheets' },
      { icon: 'Target', value: '420', label: 'Practice Problems' }
    ]
  },
  {
    id: 'msc-entrance',
    title: 'M.Sc Entrance',
    description: 'Unified syllabus notes for IIT JAM, TIFR, and central university entrance tests in physical sciences.',
    icon: 'GraduationCap',
    heroTitle: 'M.Sc Chemistry Entrance Notes',
    heroDescription: 'Comprehensive Chemistry notes for IIT JAM, CUET PG, TIFR, BHU, CUSAT and other M.Sc entrance examinations.',
    themeGradient: 'from-[#4A0E1B] to-[#2D0810]',
    filters: ['All', 'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Analytical Chemistry'],
    quickStats: [
      { icon: 'BookOpen', value: '74', label: 'Notes' },
      { icon: 'Library', value: '14', label: 'Chapters' },
      { icon: 'FileText', value: '28', label: 'Formula Sheets' },
      { icon: 'Target', value: '710', label: 'Previous Questions' }
    ]
  }
];

// Re-export for convenience
export { SUBJECTS };

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-gen-1',
    course: 'jee-main',
    subject: 'Physical Chemistry',
    chapter: 'Mole Concept',
    title: 'Mole Concept',
    description: 'Complete notes covering Mole Concept and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '1.5 MB',
    downloadCount: 737,
    tags: []
  ,
    difficulty: 'Hard',
    year: 2020
  },
  {
    id: 'note-gen-2',
    course: 'jee-main',
    subject: 'Physical Chemistry',
    chapter: 'Atomic Structure',
    title: 'Atomic Structure',
    description: 'Complete notes covering Atomic Structure and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '1.7 MB',
    downloadCount: 790,
    tags: []
  ,
    difficulty: 'Easy',
    year: 2022
  },
  {
    id: 'note-gen-3',
    course: 'jee-main',
    subject: 'Physical Chemistry',
    chapter: 'Chemical Bonding',
    title: 'Chemical Bonding',
    description: 'Complete notes covering Chemical Bonding and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '3.1 MB',
    downloadCount: 520,
    tags: []
  ,
    difficulty: 'Hard'
  },
  {
    id: 'note-gen-4',
    course: 'jee-main',
    subject: 'Physical Chemistry',
    chapter: 'Thermodynamics',
    title: 'Thermodynamics',
    description: 'Complete notes covering Thermodynamics and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '3.6 MB',
    downloadCount: 372,
    tags: []
  ,
    difficulty: 'Moderate'
  },
  {
    id: 'note-gen-5',
    course: 'jee-main',
    subject: 'Physical Chemistry',
    chapter: 'Chemical Equilibrium',
    title: 'Chemical Equilibrium',
    description: 'Complete notes covering Chemical Equilibrium and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '2.2 MB',
    downloadCount: 450,
    tags: []
  ,
    difficulty: 'Hard'
  },
  {
    id: 'note-gen-6',
    course: 'jee-main',
    subject: 'Physical Chemistry',
    chapter: 'Ionic Equilibrium',
    title: 'Ionic Equilibrium',
    description: 'Complete notes covering Ionic Equilibrium and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '3.4 MB',
    downloadCount: 124,
    tags: []
  ,
    difficulty: 'Hard'
  },
  {
    id: 'note-gen-7',
    course: 'jee-main',
    subject: 'Physical Chemistry',
    chapter: 'Electrochemistry',
    title: 'Electrochemistry',
    description: 'Complete notes covering Electrochemistry and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '3.1 MB',
    downloadCount: 993,
    tags: []
  ,
    difficulty: 'Hard'
  },
  {
    id: 'note-gen-8',
    course: 'jee-main',
    subject: 'Physical Chemistry',
    chapter: 'Chemical Kinetics',
    title: 'Chemical Kinetics',
    description: 'Complete notes covering Chemical Kinetics and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '1.9 MB',
    downloadCount: 102,
    tags: []
  ,
    difficulty: 'Moderate',
    year: 2021
  },
  {
    id: 'note-gen-9',
    course: 'jee-main',
    subject: 'Organic Chemistry',
    chapter: 'Redox Reactions',
    title: 'Redox Reactions',
    description: 'Complete notes covering Redox Reactions and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '1.5 MB',
    downloadCount: 1047,
    tags: []
  ,
    difficulty: 'Moderate',
    year: 2022
  },
  {
    id: 'note-gen-10',
    course: 'jee-main',
    subject: 'Inorganic Chemistry',
    chapter: 'Coordination Compounds',
    title: 'Coordination Compounds',
    description: 'Complete notes covering Coordination Compounds and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '1.2 MB',
    downloadCount: 983,
    tags: []
  ,
    difficulty: 'Easy'
  },
  {
    id: 'note-gen-11',
    course: 'jee-main',
    subject: 'Inorganic Chemistry',
    chapter: 'd & f Block',
    title: 'd & f Block',
    description: 'Complete notes covering d & f Block and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '2.3 MB',
    downloadCount: 361,
    tags: []
  ,
    difficulty: 'Hard'
  },
  {
    id: 'note-gen-12',
    course: 'jee-main',
    subject: 'Inorganic Chemistry',
    chapter: 'p Block',
    title: 'p Block',
    description: 'Complete notes covering p Block and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '2.1 MB',
    downloadCount: 989,
    tags: []
  ,
    difficulty: 'Moderate'
  },
  {
    id: 'note-gen-13',
    course: 'jee-main',
    subject: 'Organic Chemistry',
    chapter: 'Organic Reaction Mechanisms',
    title: 'Organic Reaction Mechanisms',
    description: 'Complete notes covering Organic Reaction Mechanisms and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '3.4 MB',
    downloadCount: 411,
    tags: []
  ,
    difficulty: 'Hard'
  },
  {
    id: 'note-gen-14',
    course: 'jee-main',
    subject: 'Organic Chemistry',
    chapter: 'Alcohols, Phenols & Ethers',
    title: 'Alcohols, Phenols & Ethers',
    description: 'Complete notes covering Alcohols, Phenols & Ethers and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '3.4 MB',
    downloadCount: 1019,
    tags: []
  ,
    difficulty: 'Easy'
  },
  {
    id: 'note-gen-15',
    course: 'jee-main',
    subject: 'Organic Chemistry',
    chapter: 'Aldehydes & Ketones',
    title: 'Aldehydes & Ketones',
    description: 'Complete notes covering Aldehydes & Ketones and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '3.5 MB',
    downloadCount: 440,
    tags: []
  ,
    difficulty: 'Moderate'
  },
  {
    id: 'note-gen-16',
    course: 'jee-advanced',
    subject: 'Physical Chemistry',
    chapter: 'Advanced Chemical Bonding',
    title: 'Advanced Chemical Bonding',
    description: 'Complete notes covering Advanced Chemical Bonding and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '2.6 MB',
    downloadCount: 815,
    tags: []
  ,
    difficulty: 'Moderate',
    isAdvanced: true
  },
  {
    id: 'note-gen-17',
    course: 'jee-advanced',
    subject: 'Physical Chemistry',
    chapter: 'Quantum Chemistry',
    title: 'Quantum Chemistry',
    description: 'Complete notes covering Quantum Chemistry and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '3.3 MB',
    downloadCount: 1028,
    tags: ["Quantum Chemistry"]
  ,
    difficulty: 'Easy',
    year: 2020,
    isAdvanced: true
  },
  {
    id: 'note-gen-18',
    course: 'jee-advanced',
    subject: 'Physical Chemistry',
    chapter: 'Advanced Thermodynamics',
    title: 'Advanced Thermodynamics',
    description: 'Complete notes covering Advanced Thermodynamics and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '2.3 MB',
    downloadCount: 718,
    tags: []
  ,
    difficulty: 'Hard',
    year: 2023,
    isAdvanced: true
  },
  {
    id: 'note-gen-19',
    course: 'jee-advanced',
    subject: 'Physical Chemistry',
    chapter: 'Electrochemistry Problems',
    title: 'Electrochemistry Problems',
    description: 'Complete notes covering Electrochemistry Problems and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '3.9 MB',
    downloadCount: 929,
    tags: ["Advanced Problems"]
  ,
    difficulty: 'Easy',
    year: 2018,
    isAdvanced: true
  },
  {
    id: 'note-gen-20',
    course: 'jee-advanced',
    subject: 'Organic Chemistry',
    chapter: 'Advanced Organic Mechanisms',
    title: 'Advanced Organic Mechanisms',
    description: 'Complete notes covering Advanced Organic Mechanisms and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '1.4 MB',
    downloadCount: 1053,
    tags: []
  ,
    difficulty: 'Moderate',
    year: 2023,
    isAdvanced: true
  },
  {
    id: 'note-gen-21',
    course: 'jee-advanced',
    subject: 'Organic Chemistry',
    chapter: 'Named Reactions',
    title: 'Named Reactions',
    description: 'Complete notes covering Named Reactions and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '2.7 MB',
    downloadCount: 862,
    tags: []
  ,
    difficulty: 'Hard',
    year: 2023,
    isAdvanced: true
  },
  {
    id: 'note-gen-22',
    course: 'jee-advanced',
    subject: 'Organic Chemistry',
    chapter: 'Stereochemistry',
    title: 'Stereochemistry',
    description: 'Complete notes covering Stereochemistry and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '1.7 MB',
    downloadCount: 1004,
    tags: []
  ,
    difficulty: 'Moderate',
    year: 2020,
    isAdvanced: true
  },
  {
    id: 'note-gen-23',
    course: 'jee-advanced',
    subject: 'Inorganic Chemistry',
    chapter: 'Coordination Chemistry',
    title: 'Coordination Chemistry',
    description: 'Complete notes covering Coordination Chemistry and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '1.8 MB',
    downloadCount: 1026,
    tags: []
  ,
    difficulty: 'Easy',
    year: 2018
  },
  {
    id: 'note-gen-24',
    course: 'jee-advanced',
    subject: 'Physical Chemistry',
    chapter: 'Surface Chemistry',
    title: 'Surface Chemistry',
    description: 'Complete notes covering Surface Chemistry and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '1.3 MB',
    downloadCount: 594,
    tags: []
  ,
    difficulty: 'Easy',
    isAdvanced: true
  },
  {
    id: 'note-gen-25',
    course: 'jee-advanced',
    subject: 'Physical Chemistry',
    chapter: 'Solid State',
    title: 'Solid State',
    description: 'Complete notes covering Solid State and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '2.7 MB',
    downloadCount: 843,
    tags: []
  ,
    difficulty: 'Easy',
    isAdvanced: true
  },
  {
    id: 'note-gen-26',
    course: 'jee-advanced',
    subject: 'Physical Chemistry',
    chapter: 'Previous Year Questions',
    title: 'Previous Year Questions',
    description: 'Complete notes covering Previous Year Questions and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '1.8 MB',
    downloadCount: 776,
    tags: ["PYQ Analysis","Previous Papers"]
  ,
    difficulty: 'Moderate'
  },
  {
    id: 'note-gen-27',
    course: 'jee-advanced',
    subject: 'Physical Chemistry',
    chapter: 'Multi Concept Revision',
    title: 'Multi Concept Revision',
    description: 'Complete notes covering Multi Concept Revision and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '1.0 MB',
    downloadCount: 982,
    tags: ["Revision Notes"]
  ,
    difficulty: 'Hard',
    year: 2022
  },
  {
    id: 'note-gen-28',
    course: 'neet',
    subject: 'Physical Chemistry',
    chapter: 'Mole Concept',
    title: 'Mole Concept',
    description: 'Complete notes covering Mole Concept and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '3.1 MB',
    downloadCount: 438,
    tags: ["NCERT Highlights","Revision Notes"]
  ,
    difficulty: 'Hard',
    year: 2019
  },
  {
    id: 'note-gen-29',
    course: 'neet',
    subject: 'Physical Chemistry',
    chapter: 'Atomic Structure',
    title: 'Atomic Structure',
    description: 'Complete notes covering Atomic Structure and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '2.2 MB',
    downloadCount: 583,
    tags: ["NCERT Highlights","Revision Notes"]
  ,
    difficulty: 'Hard'
  },
  {
    id: 'note-gen-30',
    course: 'neet',
    subject: 'Organic Chemistry',
    chapter: 'Biomolecules',
    title: 'Biomolecules',
    description: 'Complete notes covering Biomolecules and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '3.6 MB',
    downloadCount: 294,
    tags: ["NCERT Highlights","Revision Notes"]
  ,
    difficulty: 'Easy'
  },
  {
    id: 'note-gen-31',
    course: 'neet',
    subject: 'Organic Chemistry',
    chapter: 'Polymers',
    title: 'Polymers',
    description: 'Complete notes covering Polymers and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '1.6 MB',
    downloadCount: 768,
    tags: ["NCERT Highlights","Revision Notes"]
  ,
    difficulty: 'Moderate'
  },
  {
    id: 'note-gen-32',
    course: 'neet',
    subject: 'Physical Chemistry',
    chapter: 'Chemistry in Everyday Life',
    title: 'Chemistry in Everyday Life',
    description: 'Complete notes covering Chemistry in Everyday Life and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '2.1 MB',
    downloadCount: 600,
    tags: ["NCERT Highlights","Revision Notes"]
  ,
    difficulty: 'Easy'
  },
  {
    id: 'note-gen-33',
    course: 'neet',
    subject: 'Inorganic Chemistry',
    chapter: 'p Block',
    title: 'p Block',
    description: 'Complete notes covering p Block and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '1.3 MB',
    downloadCount: 691,
    tags: ["NCERT Highlights","Revision Notes"]
  ,
    difficulty: 'Easy'
  },
  {
    id: 'note-gen-34',
    course: 'neet',
    subject: 'Inorganic Chemistry',
    chapter: 'd & f Block',
    title: 'd & f Block',
    description: 'Complete notes covering d & f Block and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '1.6 MB',
    downloadCount: 953,
    tags: ["NCERT Highlights","Revision Notes"]
  ,
    difficulty: 'Easy',
    year: 2018
  },
  {
    id: 'note-gen-35',
    course: 'neet',
    subject: 'Physical Chemistry',
    chapter: 'Chemical Bonding',
    title: 'Chemical Bonding',
    description: 'Complete notes covering Chemical Bonding and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '3.1 MB',
    downloadCount: 810,
    tags: ["NCERT Highlights","Revision Notes"]
  ,
    difficulty: 'Easy'
  },
  {
    id: 'note-gen-36',
    course: 'neet',
    subject: 'Inorganic Chemistry',
    chapter: 'Coordination Compounds',
    title: 'Coordination Compounds',
    description: 'Complete notes covering Coordination Compounds and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '3.7 MB',
    downloadCount: 495,
    tags: ["NCERT Highlights","Revision Notes"]
  ,
    difficulty: 'Easy',
    year: 2022
  },
  {
    id: 'note-gen-37',
    course: 'neet',
    subject: 'Organic Chemistry',
    chapter: 'Hydrocarbons',
    title: 'Hydrocarbons',
    description: 'Complete notes covering Hydrocarbons and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '2.3 MB',
    downloadCount: 1077,
    tags: ["NCERT Highlights","Revision Notes"]
  ,
    difficulty: 'Moderate',
    year: 2020
  },
  {
    id: 'note-gen-38',
    course: 'neet',
    subject: 'Organic Chemistry',
    chapter: 'Haloalkanes',
    title: 'Haloalkanes',
    description: 'Complete notes covering Haloalkanes and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '1.4 MB',
    downloadCount: 1059,
    tags: ["NCERT Highlights","Revision Notes"]
  ,
    difficulty: 'Easy',
    year: 2021
  },
  {
    id: 'note-gen-39',
    course: 'neet',
    subject: 'Organic Chemistry',
    chapter: 'Alcohols',
    title: 'Alcohols',
    description: 'Complete notes covering Alcohols and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '2.9 MB',
    downloadCount: 838,
    tags: ["NCERT Highlights","Revision Notes"]
  ,
    difficulty: 'Moderate'
  },
  {
    id: 'note-gen-40',
    course: 'neet',
    subject: 'Organic Chemistry',
    chapter: 'Amines',
    title: 'Amines',
    description: 'Complete notes covering Amines and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '1.5 MB',
    downloadCount: 157,
    tags: ["NCERT Highlights","Revision Notes"]
  ,
    difficulty: 'Easy'
  },
  {
    id: 'note-gen-41',
    course: 'neet',
    subject: 'Physical Chemistry',
    chapter: 'Environmental Chemistry',
    title: 'Environmental Chemistry',
    description: 'Complete notes covering Environmental Chemistry and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '3.7 MB',
    downloadCount: 919,
    tags: ["NCERT Highlights","Revision Notes"]
  ,
    difficulty: 'Easy'
  },
  {
    id: 'note-gen-42',
    course: 'net',
    subject: 'Physical Chemistry',
    chapter: 'Quantum Mechanics',
    title: 'Quantum Mechanics',
    description: 'Complete notes covering Quantum Mechanics and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '2.6 MB',
    downloadCount: 720,
    tags: ["Quantum Chemistry"]
  ,
    difficulty: 'Easy'
  },
  {
    id: 'note-gen-43',
    course: 'net',
    subject: 'Physical Chemistry',
    chapter: 'Group Theory',
    title: 'Group Theory',
    description: 'Complete notes covering Group Theory and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '2.4 MB',
    downloadCount: 832,
    tags: []
  ,
    difficulty: 'Hard'
  },
  {
    id: 'note-gen-44',
    course: 'net',
    subject: 'Analytical Chemistry',
    chapter: 'Molecular Spectroscopy',
    title: 'Molecular Spectroscopy',
    description: 'Complete notes covering Molecular Spectroscopy and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '2.2 MB',
    downloadCount: 896,
    tags: ["Spectroscopy"]
  ,
    difficulty: 'Hard'
  },
  {
    id: 'note-gen-45',
    course: 'net',
    subject: 'Physical Chemistry',
    chapter: 'Statistical Thermodynamics',
    title: 'Statistical Thermodynamics',
    description: 'Complete notes covering Statistical Thermodynamics and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '2.3 MB',
    downloadCount: 953,
    tags: []
  ,
    difficulty: 'Hard',
    year: 2022
  },
  {
    id: 'note-gen-46',
    course: 'net',
    subject: 'Inorganic Chemistry',
    chapter: 'Organometallic Chemistry',
    title: 'Organometallic Chemistry',
    description: 'Complete notes covering Organometallic Chemistry and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '1.7 MB',
    downloadCount: 135,
    tags: []
  ,
    difficulty: 'Moderate',
    year: 2021
  },
  {
    id: 'note-gen-47',
    course: 'net',
    subject: 'Physical Chemistry',
    chapter: 'Bioinorganic Chemistry',
    title: 'Bioinorganic Chemistry',
    description: 'Complete notes covering Bioinorganic Chemistry and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '3.1 MB',
    downloadCount: 844,
    tags: []
  ,
    difficulty: 'Easy',
    year: 2020
  },
  {
    id: 'note-gen-48',
    course: 'net',
    subject: 'Inorganic Chemistry',
    chapter: 'Advanced Coordination Chemistry',
    title: 'Advanced Coordination Chemistry',
    description: 'Complete notes covering Advanced Coordination Chemistry and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '3.6 MB',
    downloadCount: 834,
    tags: []
  ,
    difficulty: 'Easy'
  },
  {
    id: 'note-gen-49',
    course: 'net',
    subject: 'Organic Chemistry',
    chapter: 'Reaction Mechanisms',
    title: 'Reaction Mechanisms',
    description: 'Complete notes covering Reaction Mechanisms and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '3.3 MB',
    downloadCount: 1004,
    tags: []
  ,
    difficulty: 'Easy',
    year: 2020
  },
  {
    id: 'note-gen-50',
    course: 'net',
    subject: 'Analytical Chemistry',
    chapter: 'NMR Spectroscopy',
    title: 'NMR Spectroscopy',
    description: 'Complete notes covering NMR Spectroscopy and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '1.9 MB',
    downloadCount: 295,
    tags: ["Spectroscopy"]
  ,
    difficulty: 'Easy',
    year: 2020
  },
  {
    id: 'note-gen-51',
    course: 'net',
    subject: 'Analytical Chemistry',
    chapter: 'IR Spectroscopy',
    title: 'IR Spectroscopy',
    description: 'Complete notes covering IR Spectroscopy and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '2.3 MB',
    downloadCount: 1065,
    tags: ["Spectroscopy"]
  ,
    difficulty: 'Hard',
    year: 2023
  },
  {
    id: 'note-gen-52',
    course: 'net',
    subject: 'Analytical Chemistry',
    chapter: 'UV Spectroscopy',
    title: 'UV Spectroscopy',
    description: 'Complete notes covering UV Spectroscopy and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '1.4 MB',
    downloadCount: 805,
    tags: ["Spectroscopy"]
  ,
    difficulty: 'Easy'
  },
  {
    id: 'note-gen-53',
    course: 'net',
    subject: 'Analytical Chemistry',
    chapter: 'Mass Spectrometry',
    title: 'Mass Spectrometry',
    description: 'Complete notes covering Mass Spectrometry and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '1.9 MB',
    downloadCount: 447,
    tags: []
  ,
    difficulty: 'Easy'
  },
  {
    id: 'note-gen-54',
    course: 'msc-entrance',
    subject: 'Physical Chemistry',
    chapter: 'Chemical Thermodynamics',
    title: 'Chemical Thermodynamics',
    description: 'Complete notes covering Chemical Thermodynamics and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '2.3 MB',
    downloadCount: 701,
    tags: []
  ,
    difficulty: 'Easy'
  },
  {
    id: 'note-gen-55',
    course: 'msc-entrance',
    subject: 'Physical Chemistry',
    chapter: 'Electrochemistry',
    title: 'Electrochemistry',
    description: 'Complete notes covering Electrochemistry and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '1.5 MB',
    downloadCount: 338,
    tags: []
  ,
    difficulty: 'Moderate',
    year: 2018
  },
  {
    id: 'note-gen-56',
    course: 'msc-entrance',
    subject: 'Physical Chemistry',
    chapter: 'Chemical Kinetics',
    title: 'Chemical Kinetics',
    description: 'Complete notes covering Chemical Kinetics and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '3.2 MB',
    downloadCount: 323,
    tags: []
  ,
    difficulty: 'Hard',
    year: 2023
  },
  {
    id: 'note-gen-57',
    course: 'msc-entrance',
    subject: 'Organic Chemistry',
    chapter: 'Organic Reaction Mechanisms',
    title: 'Organic Reaction Mechanisms',
    description: 'Complete notes covering Organic Reaction Mechanisms and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '2.9 MB',
    downloadCount: 764,
    tags: []
  ,
    difficulty: 'Moderate'
  },
  {
    id: 'note-gen-58',
    course: 'msc-entrance',
    subject: 'Inorganic Chemistry',
    chapter: 'Coordination Chemistry',
    title: 'Coordination Chemistry',
    description: 'Complete notes covering Coordination Chemistry and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '2.5 MB',
    downloadCount: 782,
    tags: []
  ,
    difficulty: 'Hard',
    year: 2019
  },
  {
    id: 'note-gen-59',
    course: 'msc-entrance',
    subject: 'Analytical Chemistry',
    chapter: 'Molecular Spectroscopy',
    title: 'Molecular Spectroscopy',
    description: 'Complete notes covering Molecular Spectroscopy and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '3.0 MB',
    downloadCount: 179,
    tags: ["Spectroscopy"]
  ,
    difficulty: 'Easy',
    year: 2021
  },
  {
    id: 'note-gen-60',
    course: 'msc-entrance',
    subject: 'Physical Chemistry',
    chapter: 'Solid State Chemistry',
    title: 'Solid State Chemistry',
    description: 'Complete notes covering Solid State Chemistry and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '2.1 MB',
    downloadCount: 466,
    tags: []
  ,
    difficulty: 'Moderate',
    year: 2018
  },
  {
    id: 'note-gen-61',
    course: 'msc-entrance',
    subject: 'Physical Chemistry',
    chapter: 'Quantum Chemistry',
    title: 'Quantum Chemistry',
    description: 'Complete notes covering Quantum Chemistry and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '2.0 MB',
    downloadCount: 858,
    tags: ["Quantum Chemistry"]
  ,
    difficulty: 'Easy'
  },
  {
    id: 'note-gen-62',
    course: 'msc-entrance',
    subject: 'Physical Chemistry',
    chapter: 'Surface Chemistry',
    title: 'Surface Chemistry',
    description: 'Complete notes covering Surface Chemistry and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '1.7 MB',
    downloadCount: 401,
    tags: []
  ,
    difficulty: 'Easy'
  },
  {
    id: 'note-gen-63',
    course: 'msc-entrance',
    subject: 'Physical Chemistry',
    chapter: 'Group Theory',
    title: 'Group Theory',
    description: 'Complete notes covering Group Theory and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '3.6 MB',
    downloadCount: 1028,
    tags: []
  ,
    difficulty: 'Easy',
    year: 2022
  },
  {
    id: 'note-gen-64',
    course: 'msc-entrance',
    subject: 'Analytical Chemistry',
    chapter: 'Analytical Techniques',
    title: 'Analytical Techniques',
    description: 'Complete notes covering Analytical Techniques and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '2.9 MB',
    downloadCount: 191,
    tags: ["Analytical"]
  ,
    difficulty: 'Easy',
    year: 2021
  },
  {
    id: 'note-gen-65',
    course: 'msc-entrance',
    subject: 'Physical Chemistry',
    chapter: 'Practice Questions',
    title: 'Practice Questions',
    description: 'Complete notes covering Practice Questions and previous year concepts.',
    fileUrl: 'sample.pdf',
    fileSize: '3.9 MB',
    downloadCount: 538,
    tags: []
  ,
    difficulty: 'Easy',
    year: 2020
  }
];

export const INITIAL_VIDEOS: Video[] = [
  // JEE Main
  {
    id: 'vid-jm-1',
    course: 'jee-main',
    subject: 'Physical Chemistry',
    chapter: 'Electrostatics',
    title: "Visualising Gauss's Law & Electric Field Lines",
    youtubeLink: 'https://www.youtube.com/watch?v=g-lWKa20Z5s',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    description: "An intuitive, geometric lecture on electric field fluxes, Gauss's surfaces, and electrostatic fields in conductors.",
    duration: '45:12'
  },
  {
    id: 'vid-jm-2',
    course: 'jee-main',
    subject: 'Organic Chemistry',
    chapter: 'Hydrocarbons',
    title: 'Alkene Reactions: Addition Mechanisms Explained',
    youtubeLink: 'https://www.youtube.com/watch?v=g-lWKa20Z5s',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    description: 'Breaking down Markovnikov and anti-Markovnikov addition, halogenation, hydration, and ozonolysis step by step.',
    duration: '52:40'
  },

  // JEE Advanced
  {
    id: 'vid-ja-1',
    course: 'jee-advanced',
    subject: 'Physical Chemistry',
    chapter: 'Electrochemistry',
    title: 'Nernst Equation & Electrochemical Cell Analysis',
    youtubeLink: 'https://www.youtube.com/watch?v=g-lWKa20Z5s',
    thumbnail: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80',
    description: 'Solving complex electrochemical cell problems, standard reduction potentials, and concentration cell calculations.',
    duration: '1:12:15'
  },

  // NEET
  {
    id: 'vid-nt-1',
    course: 'neet',
    subject: 'Inorganic Chemistry',
    chapter: 'Hydrogen & Its Compounds',
    title: 'Hydrogen: Isotopes, Preparation & Industrial Uses',
    youtubeLink: 'https://www.youtube.com/watch?v=g-lWKa20Z5s',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    description: 'Visual breakdown of protium, deuterium, tritium properties, manufacture of hydrogen, and water chemistry.',
    duration: '38:50'
  }
];

export const INITIAL_PYQS: PYQ[] = [
  // JEE Main
  {
    id: 'pyq-jm-1',
    course: 'jee-main',
    subject: 'Physical Chemistry',
    chapter: 'Electrostatics',
    year: 2024,
    difficulty: 'Medium',
    questionUrl: 'pyq-jee-main-electrostatics-2024.pdf',
    solutionUrl: 'sol-jee-main-electrostatics-2024.pdf',
    questionSize: '420 KB',
    solutionSize: '1.2 MB'
  },
  {
    id: 'pyq-jm-2',
    course: 'jee-main',
    subject: 'Organic Chemistry',
    chapter: 'Reaction Mechanisms',
    year: 2023,
    difficulty: 'Hard',
    questionUrl: 'pyq-jee-main-mechanisms-2023.pdf',
    solutionUrl: 'sol-jee-main-mechanisms-2023.pdf',
    questionSize: '510 KB',
    solutionSize: '1.5 MB'
  },

  // JEE Advanced
  {
    id: 'pyq-ja-1',
    course: 'jee-advanced',
    subject: 'Physical Chemistry',
    chapter: 'Chemical Kinetics',
    year: 2024,
    difficulty: 'Hard',
    questionUrl: 'pyq-jee-adv-kinetics-2024.pdf',
    solutionUrl: 'sol-jee-adv-kinetics-2024.pdf',
    questionSize: '620 KB',
    solutionSize: '2.1 MB'
  },
  {
    id: 'pyq-ja-2',
    course: 'jee-advanced',
    subject: 'Inorganic Chemistry',
    chapter: 'Coordination Compounds',
    year: 2022,
    difficulty: 'Hard',
    questionUrl: 'pyq-jee-adv-coordination-2022.pdf',
    solutionUrl: 'sol-jee-adv-coordination-2022.pdf',
    questionSize: '390 KB',
    solutionSize: '1.4 MB'
  }
];

export const INITIAL_PRACTICE_SHEETS: PracticeSheet[] = [
  // JEE Main
  {
    id: 'ps-jm-1',
    course: 'jee-main',
    subject: 'Physical Chemistry',
    chapter: 'Electrostatics',
    title: 'Electrostatic Potential and Capacitors Drill',
    description: '45 targeted multiple-choice questions on capacitor networks, dielectric insertions, and energy storage formulas.',
    fileUrl: 'ps-electrostatics-potentials.pdf',
    fileSize: '1.1 MB'
  },
  {
    id: 'ps-jm-2',
    course: 'jee-main',
    subject: 'Organic Chemistry',
    chapter: 'Reaction Mechanisms',
    title: 'Organic Reaction Mechanisms Challenge Sheet',
    description: 'Practice set focusing on SN1/SN2 selectivity, carbocation stability, and stereochemical outcomes.',
    fileUrl: 'ps-organic-mechanisms.pdf',
    fileSize: '950 KB'
  },

  // JEE Advanced
  {
    id: 'ps-ja-1',
    course: 'jee-advanced',
    subject: 'Inorganic Chemistry',
    chapter: 'Coordination Compounds',
    title: 'Coordination Chemistry Level-2 Practice',
    description: 'Multi-concept integer-type and paragraph problems on CFSE, spectrochemical series, and isomerism.',
    fileUrl: 'ps-coordination-adv.pdf',
    fileSize: '1.6 MB'
  }
];

export const INITIAL_DOUBTS: Doubt[] = [
  {
    id: 'doubt-1',
    name: 'Siddharth Sharma',
    email: 'siddharth.s@student.in',
    subject: 'Physical Chemistry',
    topic: 'Chemical Kinetics',
    question: 'In chemical kinetics, how do we correctly apply the Arrhenius equation when comparing two reactions at different temperatures? Specifically, how does the frequency factor A change with temperature?',
    isAnswered: true,
    status: 'answered',
    createdAt: '2026-07-05T14:30:00Z',
    replies: [
      {
        id: 'reply-1a',
        doubt_id: 'doubt-1',
        professor_id: 'prof-001',
        reply_text: 'Excellent question, Siddharth. The frequency factor A is usually treated as temperature-independent in elementary analyses, but at a deeper level it contains a pre-exponential entropic term. For two reactions: use ln(k₂/k₁) = (Eₐ/R)(1/T₁ − 1/T₂) when A is constant. I have uploaded a comprehensive derivation under the Physical Chemistry Notes section.',
        image_urls: [],
        video_urls: [],
        audio_urls: [],
        attachment_urls: [],
        created_at: '2026-07-06T10:15:00Z',
        updated_at: '2026-07-06T10:15:00Z',
        is_edited: false,
        reply_order: 1
      }
    ]
  },
  {
    id: 'doubt-2',
    name: 'Aditi Patel',
    email: 'aditi.patel@gmail.com',
    subject: 'Organic Chemistry',
    topic: 'Diels–Alder Reaction',
    question: "How do we predict the major product in a Diels–Alder reaction when the diene isn't symmetric? Do we use FMO (frontier molecular orbital) theory or resonance arguments to assign regio-selectivity?",
    isAnswered: true,
    status: 'needs-followup',
    createdAt: '2026-07-08T09:15:00Z',
    replies: [
      {
        id: 'reply-2a',
        doubt_id: 'doubt-2',
        professor_id: 'prof-001',
        reply_text: 'Great question Aditi! For asymmetric Diels–Alder reactions, FMO theory is the most reliable framework. The "ortho" and "para" rule comes from matching the largest coefficient of the diene HOMO with the largest coefficient of the dienophile LUMO. Resonance arguments give the same answer for simple cases but FMO generalises better. The electron-withdrawing group on the dienophile determines the LUMO coefficients — I recommend working through the maleic anhydride + butadiene example first.',
        image_urls: [],
        video_urls: [],
        audio_urls: [],
        attachment_urls: [],
        created_at: '2026-07-09T11:00:00Z',
        updated_at: '2026-07-09T11:00:00Z',
        is_edited: false,
        reply_order: 1
      },
      {
        id: 'reply-2b',
        doubt_id: 'doubt-2',
        professor_id: 'student',
        reply_text: 'Thank you sir! I understood the FMO part. But what if both the diene AND dienophile are unsymmetrical — do we still use the same HOMO-LUMO coefficient matching approach?',
        image_urls: [],
        video_urls: [],
        audio_urls: [],
        attachment_urls: [],
        created_at: '2026-07-10T14:30:00Z',
        updated_at: '2026-07-10T14:30:00Z',
        is_edited: false,
        reply_order: 2
      }
    ]
  },
  {
    id: 'doubt-3',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@netprep.org',
    subject: 'Inorganic Chemistry',
    topic: 'Crystal Field Theory',
    question: 'In a complex [Co(NH₃)₄Cl₂]⁺, how do we determine which geometric isomer is more stable using Crystal Field Theory? The cis and trans configurations seem to have the same ligands so I am confused about the CFSE difference.',
    isAnswered: true,
    status: 'answered',
    createdAt: '2026-07-09T11:00:00Z',
    replies: [
      {
        id: 'reply-3a',
        doubt_id: 'doubt-3',
        professor_id: 'prof-001',
        reply_text: 'For [Co(NH₃)₄Cl₂]⁺: 1) Draw both cis and trans isomers carefully. 2) In the trans isomer, both Cl⁻ are on opposite axial positions — their weak-field influence competes directly along the z-axis. 3) In the cis isomer, the two Cl⁻ are adjacent, allowing NH₃ (stronger field) to dominate both axes more effectively. 4) Compare the CFSE: cis generally has a higher net Δ_oct contribution from the four NH₃ arranged in a more symmetric environment. A full vector-based treatment with worked calculations is in the Inorganic Chemistry CFT notes.',
        image_urls: [],
        video_urls: [],
        audio_urls: [],
        attachment_urls: [],
        created_at: '2026-07-10T09:30:00Z',
        updated_at: '2026-07-10T09:30:00Z',
        is_edited: false,
        reply_order: 1
      }
    ]
  },
  {
    id: 'doubt-4',
    name: 'Meera Nair',
    email: 'meera.nair@neetacademy.com',
    subject: 'Physical Chemistry',
    topic: 'Ionic Equilibrium',
    question: 'Does buffer capacity change when we dilute a buffer? I expected the pH to remain constant after dilution but my textbook says it shifts slightly. What is the correct explanation?',
    isAnswered: false,
    status: 'awaiting',
    createdAt: '2026-07-10T18:45:00Z',
    replies: []
  },
  {
    id: 'doubt-5',
    name: 'Arjun Mehta',
    email: 'arjun.m@jeeprep.in',
    subject: 'Physical Chemistry',
    topic: 'Thermodynamics',
    question: '',
    attachmentName: 'thermo-question.jpg',
    attachmentUrl: '',
    isAnswered: false,
    status: 'submitted',
    createdAt: '2026-07-12T17:20:00Z',
    replies: []
  },
  {
    id: 'doubt-6',
    name: 'Priya Krishnamurthy',
    email: 'priya.k@neet2026.com',
    subject: 'Organic Chemistry',
    topic: 'SN1 vs SN2 Reactions',
    question: 'When we have a secondary substrate like 2-bromobutane, how do we predict whether it will undergo SN1 or SN2? The solvent polarity, nucleophile strength, and steric factors all seem to point in different directions in different problems.',
    isAnswered: false,
    status: 'submitted',
    createdAt: '2026-07-12T19:05:00Z',
    replies: []
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'New JEE Advanced Coordination Chemistry notes are live',
    body: 'A fresh, rigorous set of notes on crystal field theory and geometric isomerism has just been added to the JEE Advanced Inorganic Chemistry section. Pair it with the Level-2 practice sheet for best results.',
    category: 'resource',
    pinned: true,
    createdAt: '2026-07-08T10:00:00Z'
  },
  {
    id: 'ann-2',
    title: 'Doubt-clearing window: every Sunday, 6–8 PM',
    body: 'From this week onwards, submitted doubts will be answered in a dedicated Sunday evening session. Post your questions before Saturday night to have them addressed first.',
    category: 'schedule',
    pinned: false,
    createdAt: '2026-07-06T09:30:00Z'
  },
  {
    id: 'ann-3',
    title: 'CSIR NET aspirants: revised Physical Chemistry roadmap',
    body: 'The quantum chemistry sequence has been reordered for a smoother build-up. Start from the Schrödinger equation note before attempting the spectroscopy problems.',
    category: 'exam',
    pinned: false,
    createdAt: '2026-07-02T14:15:00Z'
  }
];

export const INITIAL_FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'Are all resources on this website free to access?',
    answer: 'Yes. All material uploaded here — lecture notes, previous year solutions, practice worksheets, and reference guides — is entirely free. This portal is maintained solely as an academic repository to support self-study and learning.',
    category: 'general'
  },
  {
    id: 'faq-2',
    question: 'How often are the learning materials updated?',
    answer: 'Notes and practice sheets are added or revised in accordance with ongoing academic cycles, typically aligning with major semester schedules and upcoming national examination calendars.',
    category: 'general'
  },
  {
    id: 'faq-3',
    question: 'Can I submit questions or doubts for topics not listed in the exams?',
    answer: 'While you can submit academic doubts via the Doubt submission tab, priority is given to students preparing for the main syllabus categories: JEE Main, JEE Advanced, NEET Chemistry, CSIR NET, and M.Sc Entrance exams.',
    category: 'doubts'
  },
  {
    id: 'faq-4',
    question: 'How do I download the PDF sheets or lecture guides?',
    answer: 'Simply click the "Download" button on any resource card. It will download the selected PDF directly to your device. There are no logins, subscriptions, or paywalls.',
    category: 'notes'
  },
  {
    id: 'faq-5',
    question: 'Are these materials enough for self-preparation?',
    answer: 'These materials are curated to build rigorous conceptual foundations and advanced problem-solving skills. They serve as a powerful companion resource. Consistency, structured problem practice, and active revision remain vital for top academic outcomes.',
    category: 'general'
  }
];
