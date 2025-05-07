import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BookOpen, Users, Star, Award, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Hero from '@/components/Hero';
import ProgramCard, { ProgramType } from '@/components/ProgramCard';
import TestimonialCard, { TestimonialType } from '@/components/TestimonialCard';
import FacultyCard, { FacultyType } from '@/components/FacultyCard';
import ContactForm from '@/components/ContactForm';
import NoticeBoard from '@/components/NoticeBoard';
import { Button } from '@/components/ui/button';

const fetchFaculty = async () => {
  const { data, error } = await supabase
    .from('faculty')
    .select('*');
  
  if (error) {
    throw error;
  }
  
  return data;
};

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: facultyData, isLoading: isFacultyLoading } = useQuery({
    queryKey: ['faculty'],
    queryFn: fetchFaculty,
  });

  const programs: ProgramType[] = [
     {
      id: 'board-class-9',
      title: 'Class 9 Board Excellence',
      description: 'Build a strong foundation for board examinations with comprehensive coverage of all subjects, regular assessments and conceptual clarity.',
      duration: '12 Months',
      groupSize: 'Max 60 Students',
      level: 'Class 9',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1744&q=80',
    },
    {
      id: 'board-class-10',
      title: 'Class 10 Board Success',
      description: 'Comprehensive preparation for 10th board exams with focus on all subjects, sample papers, previous years question practice, and exam strategies.',
      duration: '12 Months',
      groupSize: 'Max 60 Students',
      level: 'Class 10',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    },
    {
      id: 'board-class-11',
      title: 'Class 11 Board Excellence',
      description: 'Strong academic program for Class 11 students to build conceptual clarity and prepare for board exams with regular assessments and personalized attention.',
      duration: '12 Months',
      groupSize: 'Max 60 Students',
      level: 'Class 11',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1700&q=80',
    },
    {
      id: 'board-class-12',
      title: 'Class 12 Board Success',
      description: 'Complete preparation for 12th board exams with subject expertise, exam-oriented practice, previous years analysis, and result-driven methodology.',
      duration: '12 Months',
      groupSize: 'Max 60 Students',
      level: 'Class 12',
      image: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80',
    },
    {
      id: 'iit-jee-foundation',
      title: 'IIT-JEE Foundation',
      description: 'Early preparation for JEE aspirants. Build strong concepts in Physics, Chemistry and Mathematics with focus on NCERT and basic problem solving.',
      duration: '12 Months',
      groupSize: 'Max 60 Students',
      level: 'Class 9-10',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    },
    {
      id: 'iit-jee-main',
      title: 'IIT-JEE Main Intensive',
      description: 'Comprehensive preparation program for JEE Main with regular mock tests, detailed analysis and specialized faculty for Physics, Chemistry and Mathematics.',
      duration: '12 Months',
      groupSize: 'Max 60 Students',
      level: 'Class 11-12',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    },
    {
      id: 'iit-jee-advanced',
      title: 'IIT-JEE Advanced Elite',
      description: 'Specialized program for JEE Advanced aspirants with advanced problem-solving techniques, doubt clearing sessions, and personalized mentoring by IIT alumni.',
      duration: '12 Months',
      groupSize: 'Max 60 Students',
      level: 'Class 12 & Droppers',
      image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1700&q=80',
    },
    
    {
      id: 'neet-foundation',
      title: 'NEET Foundation',
      description: 'Early preparation for NEET aspirants with focus on Biology, Physics and Chemistry fundamentals, NCERT mastery and conceptual clarity.',
      duration: '12 Months',
      groupSize: 'Max 60 Students',
      level: 'Class 9-10',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1700&q=80',
    },
    {
      id: 'neet-intensive',
      title: 'NEET Intensive Program',
      description: 'Comprehensive NEET preparation with in-depth coverage of Biology, Physics and Chemistry, regular assessments, and specialized medical entrance coaching.',
      duration: '12 Months',
      groupSize: 'Max 60 Students',
      level: 'Class 11-12',
      image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    },
    
    {
      id: 'ntse-preparation',
      title: 'NTSE Preparation Program',
      description: 'Specialized coaching for National Talent Search Examination (NTSE) with focus on MAT, SAT, and comprehensive preparation for stages I and II.',
      duration: '6 Months',
      groupSize: 'Max 60 Students',
      level: 'Class 10',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    },
    
   
  ];

  const testimonials: TestimonialType[] = [
    {
      id: '1',
      name: 'Aditya Sharma',
      role: 'IIT Delhi Student',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80',
      testimonial: "The JEE coaching I received at Elite & Vision Academy was exceptional. The faculty's approach to complex topics and regular mock tests helped me secure a top rank.",
      rating: 5,
    },
    {
      id: '2',
      name: 'Priya Patel',
      role: 'NEET Qualifier',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1288&q=80',
      testimonial: "The NEET preparation program at Elite & Vision Academy gave me a structured approach to study. The biology sessions were particularly helpful in building my foundation.",
      rating: 5,
    },
    {
      id: '3',
      name: 'Raj Kumar',
      role: 'NTSE Scholar',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80',
      testimonial: "The NTSE coaching program was comprehensive and well-structured. The faculty's guidance helped me crack the exam with a good score.",
      rating: 4,
    },
  ];

  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Notice Board Section */}
      <section className="py-10 bg-white">
        <div className="section-container">
          <NoticeBoard />
        </div>
      </section>
      
      <section className="py-20 bg-white">
        <div className="section-container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Our Programs</span>
              <h2 className="heading-lg mt-2">Academic Excellence Programs</h2>
            </div>
            <Link to="/programs" className="mt-4 md:mt-0 inline-flex items-center text-primary hover:underline">
              View All Programs <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.slice(0, 6).map((program, index) => (
              <ProgramCard key={program.id} program={program} index={index} />
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/programs" className="btn-primary">
              Explore All Programs
            </Link>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100/30 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-100/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="section-container relative">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Why Choose Us</span>
            <h2 className="heading-lg mt-2 mb-4">Our Teaching Methodology</h2>
            <p className="text-muted-foreground">
              At Elite & Vision Academy, our teaching methodology focuses on comprehensive development and proven results through our four key pillars.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Concept Clarity</h3>
              <p className="text-sm text-muted-foreground">
                Strong focus on building clear concepts through visual learning and practical examples.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Expert Faculty</h3>
              <p className="text-sm text-muted-foreground">
                Learn from IIT, NIT and medical college alumni with years of teaching experience.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Regular Assessment</h3>
              <p className="text-sm text-muted-foreground">
                Frequent tests and detailed performance analysis to track progress and identify improvement areas.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Personal Attention</h3>
              <p className="text-sm text-muted-foreground">
                Small batch sizes ensure individual attention and personalized guidance for each student.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-white">
        <div className="section-container">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Our Team</span>
            <h2 className="heading-lg mt-2 mb-4">Meet Our Expert Faculty</h2>
            <p className="text-muted-foreground">
              Our dedicated team of faculty members brings decades of experience and expertise to help you achieve academic excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isFacultyLoading ? (
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="h-[400px] rounded-xl bg-gray-100 animate-pulse"></div>
              ))
            ) : facultyData ? (
              facultyData.map((faculty: FacultyType, index: number) => (
                <FacultyCard key={faculty.id} faculty={faculty} index={index} />
              ))
            ) : (
              <p>Failed to load faculty information.</p>
            )}
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="section-container">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Success Stories</span>
            <h2 className="heading-lg mt-2 mb-4">What Our Students Say</h2>
            <p className="text-muted-foreground">
              Hear from our students about how Elite & Vision Academy has helped them achieve their academic goals and secure top ranks.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Contact Us</span>
              <h2 className="heading-lg mt-2 mb-6">Start Your Academic Journey Today</h2>
              <p className="text-muted-foreground mb-8">
                Reach out to us to learn more about our programs and how we can help you achieve academic excellence. Our counselors are available to guide you through the admission process.
              </p>
              
              <div className="space-y-6">
                <div className="glass-card p-4 rounded-lg flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Visit Our Center</h3>
                    <p className="text-sm text-muted-foreground">
                      PP road, near ICICI bank, Buxar, Bihar, 802101
                    </p>
                  </div>
                </div>
                
                <div className="glass-card p-4 rounded-lg flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Call Us</h3>
                    <p className="text-sm text-muted-foreground">
                      +91 9110112530 
                    </p>
                  </div>
                </div>
                
                <div className="glass-card p-4 rounded-lg flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email Us</h3>
                    <p className="text-sm text-muted-foreground">
                      elitevision.buxar@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
