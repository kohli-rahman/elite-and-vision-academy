
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProgramCard, { ProgramType } from '@/components/ProgramCard';

const Programs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const programs: ProgramType[] = [
    {
      id: 'iit-jee-foundation',
      title: 'IIT-JEE Foundation',
      description: 'Early preparation for JEE aspirants. Build strong concepts in Physics, Chemistry and Mathematics with focus on NCERT and basic problem solving.',
      duration: '12 Months',
      groupSize: 'Max 20 Students',
      level: 'Class 9-10',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    },
    {
      id: 'iit-jee-main',
      title: 'IIT-JEE Main Intensive',
      description: 'Comprehensive preparation program for JEE Main with regular mock tests, detailed analysis and specialized faculty for Physics, Chemistry and Mathematics.',
      duration: '12 Months',
      groupSize: 'Max 15 Students',
      level: 'Class 11-12',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    },
    {
      id: 'iit-jee-advanced',
      title: 'IIT-JEE Advanced Elite',
      description: 'Specialized program for JEE Advanced aspirants with advanced problem-solving techniques, doubt clearing sessions, and personalized mentoring by IIT alumni.',
      duration: '12 Months',
      groupSize: 'Max 12 Students',
      level: 'Class 12 & Droppers',
      image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1700&q=80',
    },
    
    {
      id: 'neet-foundation',
      title: 'NEET Foundation',
      description: 'Early preparation for NEET aspirants with focus on Biology, Physics and Chemistry fundamentals, NCERT mastery and conceptual clarity.',
      duration: '12 Months',
      groupSize: 'Max 20 Students',
      level: 'Class 9-10',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1700&q=80',
    },
    {
      id: 'neet-intensive',
      title: 'NEET Intensive Program',
      description: 'Comprehensive NEET preparation with in-depth coverage of Biology, Physics and Chemistry, regular assessments, and specialized medical entrance coaching.',
      duration: '12 Months',
      groupSize: 'Max 15 Students',
      level: 'Class 11-12',
      image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    },
    
    {
      id: 'ntse-preparation',
      title: 'NTSE Preparation Program',
      description: 'Specialized coaching for National Talent Search Examination (NTSE) with focus on MAT, SAT, and comprehensive preparation for stages I and II.',
      duration: '6 Months',
      groupSize: 'Max 15 Students',
      level: 'Class 10',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    },
    
    {
      id: 'board-class-9',
      title: 'Class 9 Board Excellence',
      description: 'Build a strong foundation for board examinations with comprehensive coverage of all subjects, regular assessments and conceptual clarity.',
      duration: '12 Months',
      groupSize: 'Max 25 Students',
      level: 'Class 9',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1744&q=80',
    },
    {
      id: 'board-class-10',
      title: 'Class 10 Board Success',
      description: 'Comprehensive preparation for 10th board exams with focus on all subjects, sample papers, previous years question practice, and exam strategies.',
      duration: '12 Months',
      groupSize: 'Max 25 Students',
      level: 'Class 10',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    },
    {
      id: 'board-class-11',
      title: 'Class 11 Board Excellence',
      description: 'Strong academic program for Class 11 students to build conceptual clarity and prepare for board exams with regular assessments and personalized attention.',
      duration: '12 Months',
      groupSize: 'Max 25 Students',
      level: 'Class 11',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1700&q=80',
    },
    {
      id: 'board-class-12',
      title: 'Class 12 Board Success',
      description: 'Complete preparation for 12th board exams with subject expertise, exam-oriented practice, previous years analysis, and result-driven methodology.',
      duration: '12 Months',
      groupSize: 'Max 25 Students',
      level: 'Class 12',
      image: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80',
    },
  ];

  // Group programs by category
  const iitJeePrograms = programs.filter(program => program.id.includes('iit-jee'));
  const neetPrograms = programs.filter(program => program.id.includes('neet'));
  const ntsePrograms = programs.filter(program => program.id.includes('ntse'));
  const boardPrograms = programs.filter(program => program.id.includes('board'));

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-20 bg-white">
        <div className="section-container">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">All Programs</span>
            <h1 className="heading-lg mt-2 mb-4">Our Academic Programs</h1>
            <p className="text-muted-foreground">
              Explore our comprehensive range of academic programs designed to help students excel in their educational journey.
            </p>
          </div>

          {/* IIT-JEE Programs */}
          <div className="mb-16">
            <div className="mb-8">
              <h2 className="heading-md text-primary">IIT-JEE Programs</h2>
              <p className="text-muted-foreground mt-2">
                Specialized coaching for IIT-JEE aspirants from foundation to advanced levels.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {iitJeePrograms.map((program, index) => (
                <ProgramCard key={program.id} program={program} index={index} />
              ))}
            </div>
          </div>

          {/* NEET Programs */}
          <div className="mb-16">
            <div className="mb-8">
              <h2 className="heading-md text-primary">NEET Programs</h2>
              <p className="text-muted-foreground mt-2">
                Comprehensive coaching for NEET preparation with special focus on Biology, Physics and Chemistry.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {neetPrograms.map((program, index) => (
                <ProgramCard key={program.id} program={program} index={index} />
              ))}
            </div>
          </div>

          {/* NTSE Programs */}
          <div className="mb-16">
            <div className="mb-8">
              <h2 className="heading-md text-primary">NTSE Programs</h2>
              <p className="text-muted-foreground mt-2">
                Dedicated coaching for National Talent Search Examination to help students secure scholarships.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ntsePrograms.map((program, index) => (
                <ProgramCard key={program.id} program={program} index={index} />
              ))}
            </div>
          </div>

          {/* Board Exam Programs */}
          <div>
            <div className="mb-8">
              <h2 className="heading-md text-primary">Board Exam Programs</h2>
              <p className="text-muted-foreground mt-2">
                Structured coaching for CBSE and ICSE board examinations for classes 9 to 12.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boardPrograms.map((program, index) => (
                <ProgramCard key={program.id} program={program} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programs;
