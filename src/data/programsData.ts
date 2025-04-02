
// Program data with detailed information for each program
const programsData = {
  // IIT-JEE Programs
  'iit-jee-foundation': {
    title: 'IIT-JEE Foundation',
    description: 'Early preparation for JEE aspirants. Build strong concepts in Physics, Chemistry and Mathematics with focus on NCERT and basic problem solving.',
    longDescription: [
      'Our IIT-JEE Foundation program is specifically designed for students in Classes 9 and 10, aiming to build a strong conceptual foundation for future JEE preparation.',
      'This program focuses on developing a deep understanding of fundamental concepts in Physics, Chemistry, and Mathematics, aligned with the NCERT curriculum while introducing students to the problem-solving approach required for competitive exams.',
      'With regular assessments and personalized feedback, we help students identify and strengthen weak areas early in their academic journey.'
    ],
    duration: '12 Months',
    sessions: '144 Sessions (3 per week)',
    groupSize: 'Max 20 Students',
    level: 'Class 9-10',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    examInfo: {
      name: 'Joint Entrance Examination (JEE)',
      description: 'JEE is a standardized test conducted for admission to various engineering colleges in India. It consists of two parts: JEE Main and JEE Advanced.',
      structure: 'Two-tier examination: JEE Main followed by JEE Advanced for top performers',
      importance: 'Gateway to prestigious Indian Institutes of Technology (IITs), National Institutes of Technology (NITs), and other top engineering institutions'
    },
    subjects: [
      {
        name: 'Physics',
        topics: ['Mechanics', 'Electromagnetism', 'Optics', 'Modern Physics', 'Thermodynamics']
      },
      {
        name: 'Chemistry',
        topics: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Chemical Bonding']
      },
      {
        name: 'Mathematics',
        topics: ['Algebra', 'Calculus', 'Coordinate Geometry', 'Trigonometry', 'Statistics']
      }
    ],
    curriculum: [
      'Comprehensive coverage of NCERT syllabus',
      'Introduction to basic JEE concepts',
      'Problem-solving techniques',
      'Regular practice with foundation-level problems',
      'Monthly tests and assessments',
      'Doubt-clearing sessions',
      'Study material designed for conceptual clarity',
      'Focus on building mathematical aptitude'
    ],
    benefits: [
      'Strong foundation in Physics, Chemistry, and Mathematics',
      'Early exposure to competitive exam patterns',
      'Development of analytical thinking skills',
      'Smooth transition to advanced JEE preparation',
      'Regular performance tracking and feedback',
      'Confidence building through conceptual clarity'
    ]
  },
  'iit-jee-main': {
    title: 'IIT-JEE Main Intensive',
    description: 'Comprehensive preparation program for JEE Main with regular mock tests, detailed analysis and specialized faculty for Physics, Chemistry and Mathematics.',
    longDescription: [
      'The IIT-JEE Main Intensive program is our comprehensive coaching solution for students preparing for the JEE Main examination.',
      'This program features specialized faculty for each subject - Physics, Chemistry, and Mathematics - who are experts in the JEE Main pattern and requirements.',
      'With regular mock tests and detailed performance analysis, we ensure that students can identify their strengths and weaknesses, allowing for targeted improvement in specific areas.'
    ],
    duration: '12 Months',
    sessions: '180 Sessions (3-4 per week)',
    groupSize: 'Max 15 Students',
    level: 'Class 11-12',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    examInfo: {
      name: 'JEE Main',
      description: 'JEE Main is the first stage of the IIT-JEE examination process, serving as a qualifying exam for JEE Advanced as well as an admission test for NITs, IIITs, and other CFTIs.',
      structure: 'Computer-based test with objective questions in Physics, Chemistry, and Mathematics',
      importance: 'Qualifies candidates for JEE Advanced and determines admissions to NITs, IIITs, and other government-funded technical institutions'
    },
    subjects: [
      {
        name: 'Physics',
        topics: ['Mechanics', 'Electromagnetism', 'Optics', 'Modern Physics', 'Waves', 'Thermodynamics']
      },
      {
        name: 'Chemistry',
        topics: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Environmental Chemistry']
      },
      {
        name: 'Mathematics',
        topics: ['Algebra', 'Calculus', 'Coordinate Geometry', 'Vector Algebra', 'Statistics & Probability', 'Trigonometry']
      }
    ],
    curriculum: [
      'Complete JEE Main syllabus coverage',
      'Topic-wise and full-length mock tests',
      'Time management strategies',
      'Question paper analysis of previous years',
      'Regular problem-solving sessions',
      'Advanced level question practice',
      'Personalized weakness analysis',
      'Revision and quick recap modules'
    ],
    benefits: [
      'Comprehensive preparation for JEE Main',
      'Regular assessment through mock tests',
      'Performance tracking and detailed analytics',
      'Specialized teaching for each subject',
      'Time management skills development',
      'Increased speed and accuracy in problem-solving'
    ]
  },
  'iit-jee-advanced': {
    title: 'IIT-JEE Advanced Elite',
    description: 'Specialized program for JEE Advanced aspirants with advanced problem-solving techniques, doubt clearing sessions, and personalized mentoring by IIT alumni.',
    longDescription: [
      'The IIT-JEE Advanced Elite program is our premium offering for serious JEE Advanced aspirants, featuring personalized mentoring by IIT alumni.',
      'This program goes beyond regular coaching to develop advanced problem-solving techniques required for the challenging JEE Advanced examination.',
      'With small batch sizes and dedicated doubt-clearing sessions, we ensure that every student receives the individual attention needed to crack one of the toughest engineering entrance exams in the world.'
    ],
    duration: '12 Months',
    sessions: '200 Sessions (4 per week)',
    groupSize: 'Max 12 Students',
    level: 'Class 12 & Droppers',
    image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1700&q=80',
    examInfo: {
      name: 'JEE Advanced',
      description: 'JEE Advanced is the second stage of the JEE process, and is considered one of the most challenging undergraduate admission tests globally.',
      structure: 'Two papers with objective-type questions of higher difficulty level than JEE Main, with greater emphasis on conceptual understanding and analytical thinking',
      importance: 'Exclusive gateway for admission to the 23 Indian Institutes of Technology (IITs)'
    },
    subjects: [
      {
        name: 'Physics',
        topics: ['Classical Mechanics', 'Electrodynamics', 'Modern Physics', 'Thermodynamics & Statistical Mechanics', 'Optics', 'Waves & Oscillations']
      },
      {
        name: 'Chemistry',
        topics: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Advanced Reaction Mechanisms', 'Coordination Chemistry']
      },
      {
        name: 'Mathematics',
        topics: ['Algebra', 'Calculus', 'Coordinate Geometry', '3D Geometry', 'Differential Equations', 'Probability', 'Complex Numbers']
      }
    ],
    curriculum: [
      'In-depth coverage of JEE Advanced syllabus',
      'Advanced problem-solving techniques',
      'One-on-one doubt clearing sessions',
      'Mentoring by IIT alumni',
      'Advanced level mock tests',
      'Previous year papers analysis',
      'Specialized training for multi-conceptual problems',
      'Strategy sessions for optimal performance'
    ],
    benefits: [
      'Elite preparation for JEE Advanced',
      'Personalized attention in small batches',
      'Mentoring by experienced IIT graduates',
      'Advanced problem-solving skills development',
      'Strategic approach to the exam',
      'Higher chances of securing a seat in top IITs'
    ]
  },
  
  // NEET Programs
  'neet-foundation': {
    title: 'NEET Foundation',
    description: 'Early preparation for NEET aspirants with focus on Biology, Physics and Chemistry fundamentals, NCERT mastery and conceptual clarity.',
    longDescription: [
      'Our NEET Foundation program provides early preparation for students in Classes 9 and 10 who aspire to pursue medicine as a career.',
      'This program focuses on building strong fundamentals in Biology, Physics, and Chemistry with special emphasis on NCERT content, which forms the core of the NEET examination.',
      'We help students develop a deep conceptual understanding early on, making the transition to intensive NEET preparation in higher classes smoother and more effective.'
    ],
    duration: '12 Months',
    sessions: '144 Sessions (3 per week)',
    groupSize: 'Max 20 Students',
    level: 'Class 9-10',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1700&q=80',
    examInfo: {
      name: 'National Eligibility cum Entrance Test (NEET)',
      description: 'NEET is the uniform entrance examination for admission to medical, dental, AYUSH, and veterinary colleges across India.',
      structure: 'Single paper with objective-type questions from Physics, Chemistry, and Biology (Botany & Zoology)',
      importance: 'Mandatory for admission to all medical colleges in India (except AIIMS and JIPMER)'
    },
    subjects: [
      {
        name: 'Biology',
        topics: ['Cell Structure & Function', 'Plant Physiology', 'Human Physiology', 'Genetics', 'Ecology', 'Diversity in Living Organisms']
      },
      {
        name: 'Physics',
        topics: ['Mechanics', 'Electricity', 'Optics', 'Modern Physics', 'Heat & Thermodynamics']
      },
      {
        name: 'Chemistry',
        topics: ['Basic Concepts', 'Atomic Structure', 'Chemical Bonding', 'Organic Chemistry Introduction', 'Periodic Table']
      }
    ],
    curriculum: [
      'NCERT-based comprehensive study',
      'Foundation of biological concepts',
      'Basic physics principles for medical entrance',
      'Fundamental chemical concepts',
      'Regular assessments and tests',
      'Visual learning aids for biology',
      'Introduction to NEET-pattern questions',
      'Scientific terminology familiarity'
    ],
    benefits: [
      'Early preparation advantage for NEET',
      'Strong foundation in biology, physics, and chemistry',
      'NCERT-focused approach building required base',
      'Conceptual clarity through visual learning',
      'Introduction to medical entrance exam pattern',
      'Smooth transition to advanced NEET preparation'
    ]
  },
  'neet-intensive': {
    title: 'NEET Intensive Program',
    description: 'Comprehensive NEET preparation with in-depth coverage of Biology, Physics and Chemistry, regular assessments, and specialized medical entrance coaching.',
    longDescription: [
      'The NEET Intensive Program is our comprehensive coaching solution designed specifically for students in Classes 11, 12, and droppers preparing for the NEET examination.',
      'This program offers in-depth coverage of all NEET topics in Biology (Botany and Zoology), Physics, and Chemistry, with emphasis on NCERT content and application-based learning.',
      'With specialized faculty for medical entrance preparation, regular assessments, and detailed performance analysis, we ensure that students are thoroughly prepared for the competitive NEET examination.'
    ],
    duration: '12 Months',
    sessions: '180 Sessions (3-4 per week)',
    groupSize: 'Max 15 Students',
    level: 'Class 11-12',
    image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    examInfo: {
      name: 'NEET-UG',
      description: 'NEET-UG is the only entrance examination for admission to MBBS, BDS, AYUSH, and other medical courses in India.',
      structure: 'Single paper with 180 objective-type questions (45 each from Physics and Chemistry, 90 from Biology)',
      importance: 'Required for admission to all medical colleges in India including government, private, deemed universities, and AIIMS & JIPMER'
    },
    subjects: [
      {
        name: 'Biology (Botany & Zoology)',
        topics: ['Diversity in Living World', 'Structural Organization', 'Cell Structure & Function', 'Plant & Human Physiology', 'Genetics & Evolution', 'Biotechnology', 'Ecology & Environment']
      },
      {
        name: 'Physics',
        topics: ['Mechanics', 'Electrodynamics', 'Optics', 'Thermodynamics', 'Modern Physics', 'Electronics']
      },
      {
        name: 'Chemistry',
        topics: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Environmental Chemistry', 'Chemistry in Everyday Life']
      }
    ],
    curriculum: [
      'Complete NEET syllabus coverage',
      'NCERT-focused teaching approach',
      'Biology diagrams and visual explanations',
      'Application-based problem solving',
      'Regular mock tests with NEET pattern',
      "Previous years' question paper analysis",
      'Medical terminology and concepts',
      'Time management training'
    ],
    benefits: [
      'Comprehensive preparation for NEET',
      'Focus on Biology with equal importance to Physics and Chemistry',
      'Regular practice with NEET-pattern questions',
      'Performance tracking through mock tests',
      'Medical knowledge foundation development',
      'Strategic approach to maximize NEET score'
    ]
  },
  
  // NTSE Program
  'ntse-preparation': {
    title: 'NTSE Preparation Program',
    description: 'Specialized coaching for National Talent Search Examination (NTSE) with focus on MAT, SAT, and comprehensive preparation for stages I and II.',
    longDescription: [
      'Our NTSE Preparation Program is specially designed to help Class 10 students excel in the prestigious National Talent Search Examination.',
      'This focused program covers all aspects of the NTSE, including the Mental Ability Test (MAT) and Scholastic Aptitude Test (SAT), with comprehensive preparation for both Stage I and Stage II examinations.',
      'With experienced faculty and specialized study material, we ensure that students develop the analytical skills and knowledge required to succeed in this competitive scholarship examination.'
    ],
    duration: '6 Months',
    sessions: '72 Sessions (3 per week)',
    groupSize: 'Max 15 Students',
    level: 'Class 10',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    examInfo: {
      name: 'National Talent Search Examination (NTSE)',
      description: 'NTSE is a prestigious national-level scholarship program to identify and nurture talented students across India.',
      structure: 'Two-stage examination: Stage I (state level) and Stage II (national level). Each stage consists of Mental Ability Test (MAT) and Scholastic Aptitude Test (SAT).',
      importance: 'Offers significant scholarship up to PhD level and recognition as a National Talent Scholar'
    },
    subjects: [
      {
        name: 'Mental Ability Test (MAT)',
        topics: ['Verbal and Non-Verbal Reasoning', 'Analogy', 'Classification', 'Series Completion', 'Coding-Decoding', 'Blood Relations', 'Analytical Reasoning', 'Figure Matrix']
      },
      {
        name: 'Scholastic Aptitude Test (SAT)',
        topics: ['Science (Physics, Chemistry, Biology)', 'Mathematics', 'Social Studies (History, Geography, Civics, Economics)', 'Current Affairs']
      }
    ],
    curriculum: [
      'Comprehensive coverage of MAT patterns and techniques',
      'Subject-wise preparation for SAT',
      'Regular practice tests for both MAT and SAT',
      "Previous years' question analysis",
      'Speed enhancement techniques',
      'Stage I and Stage II specific preparation',
      'Current affairs and general knowledge updates',
      'Individual performance tracking'
    ],
    benefits: [
      'Specialized preparation for a prestigious scholarship exam',
      'Development of logical and analytical thinking',
      'Enhancement of problem-solving skills',
      'Subject knowledge strengthening',
      'Improved academic performance',
      'Preparation for future competitive exams'
    ]
  },
  
  // Board Exam Programs
  'board-class-9': {
    title: 'Class 9 Board Excellence',
    description: 'Build a strong foundation for board examinations with comprehensive coverage of all subjects, regular assessments and conceptual clarity.',
    longDescription: [
      'Our Class 9 Board Excellence program is designed to build a strong academic foundation that prepares students for both school examinations and future board exams.',
      'This comprehensive program covers all subjects in the Class 9 curriculum with focus on conceptual clarity, application skills, and exam-oriented preparation.',
      'With regular assessments, personalized feedback, and structured study material, we ensure that students develop strong academic skills and confidence early in their high school journey.'
    ],
    duration: '12 Months',
    sessions: '144 Sessions (3 per week)',
    groupSize: 'Max 25 Students',
    level: 'Class 9',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1744&q=80',
    examInfo: {
      name: 'Class 9 School Examinations',
      description: 'Class 9 examinations serve as the foundation for the upcoming board examinations in Class 10, introducing students to more comprehensive and structured assessment patterns.',
      structure: 'Theory examinations with subjective and objective questions; practical examinations for Science; internal assessments for all subjects',
      importance: 'Builds foundation for Class 10 board examinations and helps in early identification of strengths and areas for improvement'
    },
    subjects: [
      {
        name: 'Mathematics',
        topics: ['Number Systems', 'Algebra', 'Coordinate Geometry', 'Geometry', 'Mensuration', 'Statistics', 'Probability']
      },
      {
        name: 'Science',
        topics: ['Matter', 'Organization in Living World', 'Motion, Force and Work', 'Food Production', 'Natural Resources']
      },
      {
        name: 'Social Studies',
        topics: ['History (French Revolution, Nazism)', 'Geography (India - Size and Location, Physical Features)', 'Civics (Democracy, Constitution)', 'Economics (Basic Concepts)']
      },
      {
        name: 'English',
        topics: ['Literature', 'Grammar', 'Writing Skills', 'Reading Comprehension']
      }
    ],
    curriculum: [
      'Complete NCERT syllabus coverage',
      'Additional reference materials for each subject',
      'Regular class tests and assessments',
      'NCERT exercise solutions and discussions',
      'Subject-wise notes and summaries',
      'Question paper solving techniques',
      'Practical laboratory work for Science',
      'Monthly parent-teacher meetings'
    ],
    benefits: [
      'Strong foundation for all academic subjects',
      'Regular assessment and progress tracking',
      'Conceptual clarity and application skills',
      'Preparation for future competitive exams',
      'Development of good study habits',
      'Increased confidence in school examinations'
    ]
  },
  'board-class-10': {
    title: 'Class 10 Board Success',
    description: 'Comprehensive preparation for 10th board exams with focus on all subjects, sample papers, previous years question practice, and exam strategies.',
    longDescription: [
      'The Class 10 Board Success program is our comprehensive coaching solution for students appearing for Class 10 board examinations (CBSE, ICSE, or State Boards).',
      'This intensive program covers all subjects in the Class 10 curriculum with special focus on board exam patterns, marking schemes, and answering techniques.',
      "With extensive practice through sample papers, previous years' questions, and regular mock tests, we ensure that students are thoroughly prepared for this important milestone in their academic journey."
    ],
    duration: '12 Months',
    sessions: '144 Sessions (3 per week)',
    groupSize: 'Max 25 Students',
    level: 'Class 10',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    examInfo: {
      name: 'Class 10 Board Examinations',
      description: 'Class 10 Board examinations are significant milestone examinations conducted by various educational boards across India (CBSE, ICSE, State Boards).',
      structure: 'Theory examinations with both subjective and objective components; practical examinations for Science; internal assessments for all subjects',
      importance: 'First board examination experience; results influence stream selection for higher secondary education; foundation for future academic pursuits'
    },
    subjects: [
      {
        name: 'Mathematics',
        topics: ['Real Numbers', 'Polynomials', 'Pair of Linear Equations', 'Triangles', 'Trigonometry', 'Statistics', 'Probability']
      },
      {
        name: 'Science',
        topics: ['Chemical Reactions', 'Acids, Bases and Salts', 'Metals and Non-metals', 'Carbon Compounds', 'Life Processes', 'Control and Coordination', 'Light', 'Electricity']
      },
      {
        name: 'Social Studies',
        topics: ['History (Nationalism, World Wars)', 'Geography (Resources, Agriculture)', 'Civics (Power Sharing, Federalism)', 'Economics (Development, Globalization)']
      },
      {
        name: 'English',
        topics: ['Literature', 'Grammar', 'Writing Skills', 'Reading Comprehension']
      }
    ],
    curriculum: [
      'Complete board syllabus coverage',
      'Chapter-wise important questions',
      "Previous years' board papers practice",
      'Sample papers and model test papers',
      'Board-specific exam strategies',
      'Answer writing techniques',
      'Time management strategies',
      'Revision modules and quick recap sessions'
    ],
    benefits: [
      'Comprehensive preparation for board exams',
      'Understanding of board exam patterns and requirements',
      'Regular practice with board-level questions',
      'Improved answer presentation skills',
      'Effective time management during exams',
      'Higher chances of scoring excellent grades'
    ]
  },
  'board-class-11': {
    title: 'Class 11 Board Excellence',
    description: 'Strong academic program for Class 11 students to build conceptual clarity and prepare for board exams with regular assessments and personalized attention.',
    longDescription: [
      'Our Class 11 Board Excellence program is designed to help students navigate the significant jump in academic difficulty from Class 10 to Class 11.',
      'This comprehensive program covers the entire Class 11 curriculum across all streams (Science, Commerce, Humanities) with focus on building strong conceptual foundations.',
      'With regular assessments, personalized attention, and exam-oriented preparation, we ensure that students not only excel in their Class 11 examinations but also build a strong foundation for Class 12 boards and competitive exams.'
    ],
    duration: '12 Months',
    sessions: '144 Sessions (3 per week)',
    groupSize: 'Max 25 Students',
    level: 'Class 11',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1700&q=80',
    examInfo: {
      name: 'Class 11 School Examinations',
      description: 'Class 11 examinations represent a significant increase in academic rigor compared to Class 10, introducing advanced concepts and preparing students for board examinations in Class 12.',
      structure: 'Theory examinations with primarily subjective questions; practical examinations for Science subjects; project work and internal assessments',
      importance: 'Builds foundation for Class 12 board examinations and competitive entrance exams; helps students adapt to higher academic standards'
    },
    subjects: [
      {
        name: 'Science Stream',
        topics: ['Physics (Mechanics, Thermodynamics)', 'Chemistry (Physical, Organic, Inorganic)', 'Mathematics (Calculus, Algebra, Trigonometry)', 'Biology (Diversity, Plant & Animal Physiology)']
      },
      {
        name: 'Commerce Stream',
        topics: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics/Applied Mathematics']
      },
      {
        name: 'Humanities Stream',
        topics: ['History', 'Political Science', 'Geography', 'Economics', 'Psychology', 'Sociology (varies by school)']
      },
      {
        name: 'Common Subjects',
        topics: ['English', 'Physical Education', 'Computer Science/Informatics Practices (optional)']
      }
    ],
    curriculum: [
      'Stream-specific complete syllabus coverage',
      'Conceptual clarity with real-world applications',
      'Regular unit tests and assessments',
      'Preparation for school-based examinations',
      'Practical and lab work assistance',
      'Subject-wise revision materials',
      'Additional reference resources',
      'Individual doubt clearing sessions'
    ],
    benefits: [
      'Smooth transition from Class 10 to Class 11 academics',
      'Strong conceptual foundation in chosen stream',
      'Regular assessment and feedback',
      'Preparation for Class 12 board examinations',
      'Development of analytical and critical thinking',
      'Improved academic performance'
    ]
  },
  'board-class-12': {
    title: 'Class 12 Board Success',
    description: 'Complete preparation for 12th board exams with subject expertise, exam-oriented practice, previous years analysis, and result-driven methodology.',
    longDescription: [
      'The Class 12 Board Success program is our flagship offering for students appearing for Class 12 board examinations across various boards (CBSE, ICSE, State Boards).',
      'This intensive program provides comprehensive preparation for all subjects with special emphasis on understanding board exam patterns, marking schemes, and effective answer presentation.',
      'With subject matter experts, extensive practice materials, and exam-oriented strategies, we ensure that students are fully prepared for this crucial examination that significantly impacts their higher education opportunities.'
    ],
    duration: '12 Months',
    sessions: '180 Sessions (3-4 per week)',
    groupSize: 'Max 25 Students',
    level: 'Class 12',
    image: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80',
    examInfo: {
      name: 'Class 12 Board Examinations',
      description: 'Class 12 Board examinations are critical milestone examinations that significantly impact college admissions and future academic pathways.',
      structure: 'Theory examinations with primarily subjective questions; practical examinations for Science and some Commerce/Humanities subjects; project work and internal assessments',
      importance: 'Results determine college admissions; marks often considered for non-entrance based courses; crucial for overall academic profile'
    },
    subjects: [
      {
        name: 'Science Stream',
        topics: ['Physics (Electrostatics, Optics, Modern Physics)', 'Chemistry (Electrochemistry, Organic Chemistry, Polymers)', 'Mathematics (Calculus, Vectors, Probability)', 'Biology (Genetics, Evolution, Biotechnology)']
      },
      {
        name: 'Commerce Stream',
        topics: ['Accountancy (Company Accounts, Analysis of Financial Statements)', 'Business Studies (Management, Marketing)', 'Economics (Macro Economics, Indian Economy)', 'Mathematics/Applied Mathematics']
      },
      {
        name: 'Humanities Stream',
        topics: ['History (Modern India, World History)', 'Political Science (Indian Constitution, International Relations)', 'Geography (Human Geography, India - People and Economy)', 'Economics', 'Psychology', 'Sociology (varies by school)']
      },
      {
        name: 'Common Subjects',
        topics: ['English', 'Physical Education', 'Computer Science/Informatics Practices (optional)']
      }
    ],
    curriculum: [
      'Comprehensive board syllabus coverage',
      'Chapter-wise important questions and solutions',
      "Previous years' board papers analysis",
      'CBSE/ICSE/State Board specific preparation',
      'Sample papers and full-length mock tests',
      'Answer writing techniques as per board requirements',
      'Time management and exam strategy sessions',
      'Pre-board examinations with detailed feedback'
    ],
    benefits: [
      'Thorough preparation for board examinations',
      'Understanding of board-specific requirements',
      'Improved answer presentation skills',
      'Regular practice with board-pattern questions',
      'Effective exam strategies and time management',
      'Higher chances of achieving excellent results'
    ]
  }
};

// Export the program data
export default programsData;

// Types for program data
export interface Subject {
  name: string;
  topics: string[];
}

export interface ExamInfo {
  name: string;
  description: string;
  structure: string;
  importance: string;
}

export interface Program {
  title: string;
  description: string;
  longDescription: string[];
  duration: string;
  sessions: string;
  groupSize: string;
  level: string;
  image: string;
  examInfo: ExamInfo;
  subjects: Subject[];
  curriculum: string[];
  benefits: string[];
}

export type ProgramsData = {
  [key: string]: Program;
};
