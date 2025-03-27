
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Users, Award, BookOpen, CheckCircle2, ArrowLeft } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

const ProgramDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // This would typically come from an API or database
  const programs = {
    'academic': {
      title: 'Academic Excellence Program',
      description: 'Our Academic Excellence Program is designed to provide comprehensive coaching for students looking to excel in their academic subjects. With personalized attention and regular assessments, we help students develop a deep understanding of concepts and improve their performance.',
      longDescription: [
        'The Academic Excellence Program at Excellence Academy is our flagship offering, designed to help students master their core academic subjects and develop strong foundational knowledge. Our approach combines traditional teaching methods with innovative learning techniques to create an engaging and effective educational experience.',
        'Our experienced instructors work closely with each student to identify strengths and areas for improvement, creating personalized learning plans that address specific needs. Regular assessments and feedback sessions ensure continuous progress and allow for adjustments to the learning strategy as needed.',
        'The program covers all major subjects, including Mathematics, Science, English, and Social Studies, with specialized tracks available for students focusing on particular areas. We emphasize conceptual understanding rather than rote memorization, helping students develop critical thinking skills that will serve them throughout their academic journey.'
      ],
      duration: '12 Weeks',
      sessions: '36 Sessions (3 per week)',
      groupSize: 'Small Groups (5-8 students)',
      level: 'All Levels',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
      curriculum: [
        'Foundational Concepts Review',
        'Advanced Topic Exploration',
        'Problem-Solving Strategies',
        'Critical Thinking Development',
        'Study Skills Enhancement',
        'Exam Preparation Techniques',
        'Regular Practice Tests and Assessments',
        'Personalized Feedback and Progress Tracking'
      ],
      benefits: [
        'Improved academic performance',
        'Deeper understanding of subject matter',
        'Enhanced critical thinking skills',
        'Better study habits and organizational skills',
        'Increased confidence in academic abilities',
        'Preparation for higher education opportunities'
      ]
    },
    'test-prep': {
      title: 'Test Preparation Program',
      description: 'Our Test Preparation Program offers intensive coaching for standardized tests, with practice sessions and performance analytics to ensure you achieve your target score.',
      longDescription: [
        'Excellence Academy's Test Preparation Program is specifically designed to help students excel in standardized tests and entrance exams. We understand the importance of these tests in determining academic and career opportunities, and our program provides comprehensive preparation to maximize your performance.',
        'Our approach combines content review, test-taking strategies, and extensive practice to build both knowledge and confidence. We focus on understanding the format and requirements of specific tests, identifying the most effective approaches for different question types, and developing time management skills crucial for test success.',
        'Each student receives a customized study plan based on their initial assessment, with regular practice tests to track progress and pinpoint areas needing additional focus. Our instructors provide detailed feedback and strategies for improvement, ensuring that you continually enhance your performance leading up to the actual test.'
      ],
      duration: '8 Weeks',
      sessions: '24 Sessions (3 per week)',
      groupSize: 'Max 10 Students',
      level: 'Intermediate',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
      curriculum: [
        'Test Format and Structure Overview',
        'Content Review of Key Subject Areas',
        'Question Types and Optimal Approaches',
        'Time Management Strategies',
        'Practice Test Sessions',
        'Performance Analysis and Targeted Improvement',
        'Test Anxiety Management',
        'Final Preparation and Test Day Strategies'
      ],
      benefits: [
        'Comprehensive understanding of test format and requirements',
        'Effective strategies for different question types',
        'Improved time management during tests',
        'Reduced test anxiety',
        'Higher test scores',
        'Better preparation for college or career opportunities'
      ]
    },
    'career': {
      title: 'Career Development Program',
      description: 'Our Career Development Program provides guidance and skill enhancement to prepare students for the professional world, with personalized coaching and practical exercises.',
      longDescription: [
        'The Career Development Program at Excellence Academy is designed to bridge the gap between academics and professional success. In today's competitive job market, academic qualifications alone are often not enough – employers look for candidates with well-rounded skills, practical experience, and professional polish.',
        'Our program focuses on developing the essential skills needed for career success, including communication, leadership, problem-solving, and technological proficiency. We provide guidance on career path selection, resume building, interview preparation, and professional networking, helping students make informed decisions about their future.',
        'Through a combination of one-on-one coaching, workshops, and practical exercises, we help students identify their strengths and interests, set meaningful career goals, and develop strategies to achieve them. Industry exposure and interactions with professionals provide valuable insights and opportunities for real-world learning.'
      ],
      duration: '16 Weeks',
      sessions: '16 Sessions (1 per week)',
      groupSize: 'One-on-One',
      level: 'Advanced',
      image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
      curriculum: [
        'Career Assessment and Goal Setting',
        'Resume Building and Portfolio Development',
        'Interview Skills and Techniques',
        'Professional Communication',
        'Networking Strategies',
        'Industry-Specific Knowledge and Skills',
        'Workplace Ethics and Professionalism',
        'Personal Branding and Online Presence'
      ],
      benefits: [
        'Clarity on career direction and goals',
        'Professional resume and portfolio',
        'Strong interview and presentation skills',
        'Enhanced workplace readiness',
        'Development of industry-specific knowledge',
        'Increased confidence in professional interactions'
      ]
    }
  };

  const program = programs[id as keyof typeof programs];

  if (!program) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-lg mb-4">Program Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The program you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/programs" className="btn-primary">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Programs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center">
        <div className="absolute inset-0 -z-10">
          <img 
            src={program.image} 
            alt={program.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="section-container relative z-10 text-white">
          <Link to="/programs" className="inline-flex items-center text-white/80 hover:text-white mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Programs
          </Link>
          <h1 className="heading-lg mb-4">{program.title}</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            {program.description}
          </p>
          
          <div className="flex flex-wrap gap-6 mt-8">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>{program.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>{program.sessions}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span>{program.groupSize}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <span>{program.level}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-20 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="mb-12">
                <h2 className="heading-md mb-6">Program Overview</h2>
                {program.longDescription.map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              <div className="mb-12">
                <h2 className="heading-md mb-6">Curriculum</h2>
                <div className="glass-card p-6 rounded-xl">
                  <ul className="space-y-3">
                    {program.curriculum.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div>
                <h2 className="heading-md mb-6">Benefits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.benefits.map((benefit, index) => (
                    <div key={index} className="glass-card p-4 rounded-xl flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <div className="glass-card p-6 rounded-xl mb-6">
                <h3 className="text-xl font-semibold mb-4">Enroll in This Program</h3>
                <p className="text-muted-foreground mb-6">
                  Ready to take the next step? Enroll in our {program.title} today and start your journey towards excellence.
                </p>
                <Link to="/enroll" className="btn-primary w-full">
                  Enroll Now
                </Link>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Have Questions?</h3>
                <p className="text-muted-foreground mb-6">
                  Contact us for more information about this program or to schedule a consultation with one of our expert instructors.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Programs */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="section-container">
          <h2 className="heading-lg text-center mb-12">Explore Related Programs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(programs)
              .filter(([key]) => key !== id)
              .map(([key, relatedProgram]) => (
                <div key={key} className="glass-card rounded-xl overflow-hidden">
                  <img 
                    src={relatedProgram.image} 
                    alt={relatedProgram.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{relatedProgram.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {relatedProgram.description}
                    </p>
                    <Link to={`/programs/${key}`} className="btn-secondary w-full">
                      Learn More
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgramDetails;
