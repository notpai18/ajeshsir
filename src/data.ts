/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExamInfo, Note, Video, PYQ, PracticeSheet, Doubt, FAQ } from './types';

export const EXAMS: ExamInfo[] = [
  {
    id: 'jee-main',
    title: 'JEE Main',
    description: 'Comprehensive resources for JEE Main Physics & Mathematics, including concept sheets and mock drills.',
    icon: 'Compass'
  },
  {
    id: 'jee-advanced',
    title: 'JEE Advanced',
    description: 'Advanced-level problem-solving notes, multi-concept derivation guides, and deep-dive lectures.',
    icon: 'Award'
  },
  {
    id: 'neet',
    title: 'NEET Physics',
    description: 'Conceptual theory notes, formula sheets, and speed-accuracy practice booklets specialized for medical aspirants.',
    icon: 'Activity'
  },
  {
    id: 'net',
    title: 'CSIR NET',
    description: 'Postgraduate-level mathematical physics, classical mechanics, and statistical thermodynamics resources.',
    icon: 'BookOpen'
  },
  {
    id: 'msc-entrance',
    title: 'M.Sc Entrance',
    description: 'Unified syllabus notes for IIT JAM, TIFR, and central university entrance tests in physical sciences.',
    icon: 'GraduationCap'
  }
];

export const INITIAL_NOTES: Note[] = [
  // JEE Main
  {
    id: 'note-jm-1',
    course: 'jee-main',
    subject: 'Physics',
    chapter: 'Electrostatics',
    title: 'Gauss\'s Law and Field Formulations',
    description: 'Detailed analysis of electric flux, Gaussian surfaces, and derivation of fields for symmetrical charge distributions.',
    fileUrl: 'gauss-law-formulations.pdf',
    fileSize: '2.4 MB',
    downloadCount: 342
  },
  {
    id: 'note-jm-2',
    course: 'jee-main',
    subject: 'Physics',
    chapter: 'Kinematics',
    title: 'Projectile Motion on Inclined Planes',
    description: 'Mathematical breakdowns of trajectory parameters, maximum range derivations, and typical competitive exam patterns.',
    fileUrl: 'projectile-inclined-planes.pdf',
    fileSize: '1.8 MB',
    downloadCount: 512
  },
  {
    id: 'note-jm-3',
    course: 'jee-main',
    subject: 'Mathematics',
    chapter: 'Calculus',
    title: 'Limits, Continuity, and Differentiability',
    description: 'Rigorous epsilon-delta conceptual introductions, standard limits, and intermediate value theorem applications.',
    fileUrl: 'limits-continuity-guide.pdf',
    fileSize: '3.1 MB',
    downloadCount: 428
  },

  // JEE Advanced
  {
    id: 'note-ja-1',
    course: 'jee-advanced',
    subject: 'Physics',
    chapter: 'Rotational Dynamics',
    title: 'Rigid Body Collisions & Angular Impulse',
    description: 'Rigorous mathematical formulations of eccentric impacts, conservation laws during collisions, and rolling constraints.',
    fileUrl: 'rigid-body-collisions.pdf',
    fileSize: '4.2 MB',
    downloadCount: 289
  },
  {
    id: 'note-ja-2',
    course: 'jee-advanced',
    subject: 'Mathematics',
    chapter: 'Integral Calculus',
    title: 'Definite Integrals & Leibnitz Rule',
    description: 'Advanced integration reduction formulas, summation of series using integrals, and differentiation under the integral sign.',
    fileUrl: 'definite-integrals-leibnitz.pdf',
    fileSize: '3.8 MB',
    downloadCount: 310
  },

  // NEET
  {
    id: 'note-nt-1',
    course: 'neet',
    subject: 'Physics',
    chapter: 'Optics',
    title: 'Wave Optics & Young\'s Double Slit Experiment',
    description: 'Visual derivations of fringe width, coherence criteria, phase differences, and experimental modifications.',
    fileUrl: 'wave-optics-ydse.pdf',
    fileSize: '2.9 MB',
    downloadCount: 615
  },
  {
    id: 'note-nt-2',
    course: 'neet',
    subject: 'Physics',
    chapter: 'Thermodynamics',
    title: 'Carnot Engine & Thermodynamic Cycles',
    description: 'Step-by-step indicator diagrams, efficiency calculations, entropy statements, and physical significance.',
    fileUrl: 'carnot-engine-cycles.pdf',
    fileSize: '1.7 MB',
    downloadCount: 489
  },

  // NET
  {
    id: 'note-net-1',
    course: 'net',
    subject: 'Mathematical Physics',
    chapter: 'Complex Analysis',
    title: 'Cauchy Residual Theorem and Contour Integration',
    description: 'Rigorous proof of the residue theorem and its application to evaluating complex trigonometric and improper integrals.',
    fileUrl: 'cauchy-residue-integration.pdf',
    fileSize: '5.1 MB',
    downloadCount: 154
  },

  // M.Sc Entrance
  {
    id: 'note-msc-1',
    course: 'msc-entrance',
    subject: 'Classical Mechanics',
    chapter: 'Lagrangian Formalism',
    title: 'Euler-Lagrange Equations and Constraints',
    description: 'Introduction to generalized coordinates, virtual work principle, and Lagrangian derivations for double pendulums.',
    fileUrl: 'euler-lagrange-formalism.pdf',
    fileSize: '3.4 MB',
    downloadCount: 198
  }
];

export const INITIAL_VIDEOS: Video[] = [
  // JEE Main
  {
    id: 'vid-jm-1',
    course: 'jee-main',
    subject: 'Physics',
    chapter: 'Electrostatics',
    title: 'Visualizing Gauss\'s Law & Field Lines',
    youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    description: 'An intuitive, geometric lecture on electric field fluxes, Gauss\'s surfaces, and electrostatic fields in conductors.',
    duration: '45:12'
  },
  {
    id: 'vid-jm-2',
    course: 'jee-main',
    subject: 'Mathematics',
    chapter: 'Calculus',
    title: 'Understanding Limits & Continuity Geometrically',
    youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    description: 'Breaking down the concept of infinitesimals, limits, and continuous curves through dynamic graph visualizations.',
    duration: '52:40'
  },

  // JEE Advanced
  {
    id: 'vid-ja-1',
    course: 'jee-advanced',
    subject: 'Physics',
    chapter: 'Rotational Dynamics',
    title: 'Rigorous Angular Momentum Conservation Analysis',
    youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80',
    description: 'Solving complex multi-body rotation problems, rolling with slipping, and torque-free precession conceptually.',
    duration: '1:12:15'
  },

  // NEET
  {
    id: 'vid-nt-1',
    course: 'neet',
    subject: 'Physics',
    chapter: 'Optics',
    title: 'Wave Optics: Interference & Polarization',
    youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    description: 'Visual breakdown of coherent sources, double-slit patterns, polarization vectors, and Malus\'s Law.',
    duration: '38:50'
  }
];

export const INITIAL_PYQS: PYQ[] = [
  // JEE Main
  {
    id: 'pyq-jm-1',
    course: 'jee-main',
    subject: 'Physics',
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
    subject: 'Mathematics',
    chapter: 'Calculus',
    year: 2023,
    difficulty: 'Hard',
    questionUrl: 'pyq-jee-main-calculus-2023.pdf',
    solutionUrl: 'sol-jee-main-calculus-2023.pdf',
    questionSize: '510 KB',
    solutionSize: '1.5 MB'
  },

  // JEE Advanced
  {
    id: 'pyq-ja-1',
    course: 'jee-advanced',
    subject: 'Physics',
    chapter: 'Rotational Dynamics',
    year: 2024,
    difficulty: 'Hard',
    questionUrl: 'pyq-jee-adv-rotational-2024.pdf',
    solutionUrl: 'sol-jee-adv-rotational-2024.pdf',
    questionSize: '620 KB',
    solutionSize: '2.1 MB'
  },
  {
    id: 'pyq-ja-2',
    course: 'jee-advanced',
    subject: 'Physics',
    chapter: 'Thermodynamics',
    year: 2022,
    difficulty: 'Hard',
    questionUrl: 'pyq-jee-adv-thermo-2022.pdf',
    solutionUrl: 'sol-jee-adv-thermo-2022.pdf',
    questionSize: '390 KB',
    solutionSize: '1.4 MB'
  }
];

export const INITIAL_PRACTICE_SHEETS: PracticeSheet[] = [
  // JEE Main
  {
    id: 'ps-jm-1',
    course: 'jee-main',
    subject: 'Physics',
    chapter: 'Electrostatics',
    title: 'Electrostatic Potential and Capacitors Drill',
    description: '45 targeted multiple-choice questions on capacitor networks, dielectric insertions, and energy storage formulas.',
    fileUrl: 'ps-electrostatics-potentials.pdf',
    fileSize: '1.1 MB'
  },
  {
    id: 'ps-jm-2',
    course: 'jee-main',
    subject: 'Mathematics',
    chapter: 'Calculus',
    title: 'Differential Calculus Challenge Sheet',
    description: 'Practice set focusing on tangents and normals, maxima and minima theorems, and rate measures.',
    fileUrl: 'ps-differential-calculus.pdf',
    fileSize: '950 KB'
  },

  // JEE Advanced
  {
    id: 'ps-ja-1',
    course: 'jee-advanced',
    subject: 'Physics',
    chapter: 'Rotational Dynamics',
    title: 'Rigid Body Dynamics Level-2 Practice',
    description: 'Multi-concept integer-type and paragraph problems on rolling on moving planks and gyroscopic torque.',
    fileUrl: 'ps-rigid-body-adv.pdf',
    fileSize: '1.6 MB'
  }
];

export const INITIAL_DOUBTS: Doubt[] = [
  {
    id: 'doubt-1',
    name: 'Siddharth Sharma',
    email: 'siddharth.s@student.in',
    subject: 'JEE Advanced Physics - Rotational Dynamics',
    question: 'In a cylinder rolling without slipping down a movable wedge, how do we correctly formulate the constraint relation between the wedge acceleration and the rolling center acceleration?',
    attachmentName: 'constraint-diagram.jpg',
    answerText: 'Excellent question, Siddharth. To link the accelerations: 1) Express the velocity of the contact point of the cylinder with the wedge. 2) Since there is no slipping, this point\'s relative velocity to the wedge must be zero along the tangent. 3) Differentiate this constraint relation. Remember to account for the wedge\'s horizontal acceleration when translating coordinates from the ground frame to the wedge frame. I have uploaded a comprehensive step-by-step vector derivation under the Rotational Dynamics Notes section.',
    isAnswered: true,
    createdAt: '2026-07-07T14:30:00Z'
  },
  {
    id: 'doubt-2',
    name: 'Aditi Patel',
    email: 'aditi.patel@gmail.com',
    subject: 'JEE Main Mathematics - Calculus',
    question: 'How do we evaluate the limit as x approaches 0 for (sin(x) - x) / x^3 without using L\'Hopital\'s Rule? Our class hasn\'t covered derivatives yet.',
    isAnswered: false,
    createdAt: '2026-07-08T09:15:00Z'
  },
  {
    id: 'doubt-3',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@netprep.org',
    subject: 'CSIR NET - Lagrangian Mechanics',
    question: 'In a double pendulum system with equal masses and lengths, how does one decouple the small-angle Euler-Lagrange equations to find the normal modes of oscillation?',
    attachmentName: 'normal_modes.pdf',
    answerText: 'For small oscillations, Rohan: 1) Approximate the Lagrangian to quadratic order in the generalized coordinates and velocities. 2) Write the T (kinetic energy) and V (potential energy) matrices. 3) Solve the secular determinant equation det(V - w^2 T) = 0. This gives the normal frequencies. 4) Substitute these back to find the eigenvectors which yield the normal coordinates. The lower mode has masses in-phase, while the higher mode has them in anti-phase.',
    isAnswered: true,
    createdAt: '2026-07-05T11:00:00Z'
  },
  {
    id: 'doubt-4',
    name: 'Meera Nair',
    email: 'meera.nair@neetacademy.com',
    subject: 'NEET Physics - Wave Optics',
    question: 'Does the fringe width in Young\'s Double Slit Experiment change if the whole apparatus is immersed in water? How do we calculate the new fringe width?',
    isAnswered: false,
    createdAt: '2026-07-08T18:45:00Z'
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
    answer: 'While you can submit academic doubts via the Doubt submission tab, priority is given to students preparing for the main syllabus categories: JEE Main, JEE Advanced, NEET Physics, CSIR NET, and M.Sc Entrance exams.',
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
