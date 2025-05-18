
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import programsData from '@/data/programsData';
import ProgramHero from '@/components/program-details/ProgramHero';
import ProgramOverview from '@/components/program-details/ProgramOverview';
import ExamInformation from '@/components/program-details/ExamInformation';
import SubjectsTopics from '@/components/program-details/SubjectsTopics';
import Curriculum from '@/components/program-details/Curriculum';
import Benefits from '@/components/program-details/Benefits';
import EnrollmentSidebar from '@/components/program-details/EnrollmentSidebar';
import RelatedPrograms from '@/components/program-details/RelatedPrograms';
import NotFoundView from '@/components/program-details/NotFoundView';

const ProgramDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get the program data based on the ID
  const program = programsData[id as keyof typeof programsData];

  // If program doesn't exist, show not found view
  if (!program) {
    return <NotFoundView />;
  }

  // Set default values for any potentially missing properties
  const programWithDefaults = {
    ...program,
    // Add sessions with a default value if it doesn't exist
    sessions: 'sessions' in program ? program.sessions : '3 sessions per week'
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <ProgramHero program={programWithDefaults} />

      {/* Program Details */}
      <section className="py-20 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {/* Program Overview */}
              <ProgramOverview program={programWithDefaults} />
              
              {/* Exam Information */}
              <ExamInformation examInfo={programWithDefaults.examInfo} />
              
              {/* Subjects */}
              <SubjectsTopics subjects={programWithDefaults.subjects} />
              
              {/* Curriculum */}
              <Curriculum curriculum={programWithDefaults.curriculum} />
              
              {/* Benefits */}
              <Benefits benefits={programWithDefaults.benefits} />
            </div>
            
            <div>
              <EnrollmentSidebar programTitle={programWithDefaults.title} />
            </div>
          </div>
        </div>
      </section>

      {/* Related Programs */}
      <RelatedPrograms currentProgramId={id || ''} />
    </div>
  );
};

export default ProgramDetails;
