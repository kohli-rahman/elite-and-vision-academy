import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BookOpen, Users, Star, Award, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Hero from '@/components/Hero';
import ProgramCard, { ProgramType } from '@/components/ProgramCard';
import TestimonialCard, { TestimonialType } from '@/components/TestimonialCard';
import FacultyCard, { FacultyType } from '@/components/FacultyCard';
import ContactForm from '@/components/ContactForm';

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
      id: 'board-exams',
      title: 'Board Exam Excellence',
      description: 'Comprehensive coaching for CBSE and ICSE board examinations with regular assessments and personalized attention.',
      duration: '12 Months',
      groupSize: 'Small Groups',
      level: 'Class 9-12',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    },
    {
      id: 'iit-jee',
      title: 'IIT-JEE Preparation',
      description: 'Intensive coaching for IIT-JEE (Main & Advanced) with concept building, problem-solving strategies and mock tests.',
      duration: '24 Months',
      groupSize: 'Max 15 Students',
      level: 'Class 11-12',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    },
    {
      id: 'neet',
      title: 'NEET Preparation',
      description: 'Specialized coaching for NEET with in-depth subject knowledge, extensive practice, and regular performance tracking.',
      duration: '24 Months',
      groupSize: 'Max 20 Students',
      level: 'Class 11-12',
      image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    },
  ];

  const testimonials: TestimonialType[] = [
    {
      id: '1',
      name: 'Aditya Sharma',
      role: 'IIT Delhi Student',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80',
      testimonial: "The JEE coaching I received at Apex Academy was exceptional. The faculty's approach to complex topics and regular mock tests helped me secure a top rank.",
      rating: 5,
    },
    {
      id: '2',
      name: 'Priya Patel',
      role: 'NEET Qualifier',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1288&q=80',
      testimonial: "The NEET preparation program at Apex Academy gave me a structured approach to study. The biology sessions were particularly helpful in building my foundation.",
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
      
      {/* Programs Section */}
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
            {programs.map((program, index) => (
              <ProgramCard key={program.id} program={program} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100/30 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-100/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="section-container relative">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Why Choose Us</span>
            <h2 className="heading-lg mt-2 mb-4">Our Teaching Methodology</h2>
            <p className="text-muted-foreground">
              At Apex Academy, our teaching methodology focuses on comprehensive development and proven results through our four key pillars.
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
      
      {/* Faculty Section */}
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
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="section-container">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Success Stories</span>
            <h2 className="heading-lg mt-2 mb-4">What Our Students Say</h2>
            <p className="text-muted-foreground">
              Hear from our students about how Apex Academy has helped them achieve their academic goals and secure top ranks.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
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
                      123 Education Lane, New Delhi, India - 110001
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
                      +91 98765 43210
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
                      info@apexacademy.edu.in
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
