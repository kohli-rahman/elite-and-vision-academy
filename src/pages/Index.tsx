
import { useEffect } from 'react';
import Hero from '@/components/Hero';
import ProgramCard, { ProgramType } from '@/components/ProgramCard';
import TestimonialCard, { TestimonialType } from '@/components/TestimonialCard';
import InstructorProfile, { InstructorType } from '@/components/InstructorProfile';
import ContactForm from '@/components/ContactForm';
import { ArrowRight, BookOpen, Users, Star, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const programs: ProgramType[] = [
    {
      id: 'academic',
      title: 'Academic Excellence',
      description: 'Comprehensive coaching for academic subjects with personalized attention and regular assessments.',
      duration: '12 Weeks',
      groupSize: 'Small Groups',
      level: 'All Levels',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    },
    {
      id: 'test-prep',
      title: 'Test Preparation',
      description: 'Intensive preparation for standardized tests with practice sessions and performance analytics.',
      duration: '8 Weeks',
      groupSize: 'Max 10 Students',
      level: 'Intermediate',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    },
    {
      id: 'career',
      title: 'Career Development',
      description: 'Career guidance and skill enhancement programs to prepare students for the professional world.',
      duration: '16 Weeks',
      groupSize: 'One-on-One',
      level: 'Advanced',
      image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    },
  ];

  const testimonials: TestimonialType[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Medical Student',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80',
      testimonial: 'The academic coaching I received at Excellence Academy was instrumental in my success. The personalized approach and dedicated instructors made all the difference.',
      rating: 5,
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Engineering Graduate',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80',
      testimonial: 'The test preparation program helped me achieve a score I never thought possible. The strategies and practice materials were exactly what I needed.',
      rating: 5,
    },
    {
      id: '3',
      name: 'Aisha Patel',
      role: 'Business Professional',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1288&q=80',
      testimonial: 'The career development program gave me the confidence and skills to succeed in my interviews. I landed my dream job thanks to Excellence Academy!',
      rating: 4,
    },
  ];

  const instructors: InstructorType[] = [
    {
      id: '1',
      name: 'Dr. James Wilson',
      role: 'Academic Director',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
      bio: 'Ph.D. in Education with over 15 years of experience in academic coaching and curriculum development.',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
      },
    },
    {
      id: '2',
      name: 'Prof. Emily Rodriguez',
      role: 'Test Preparation Expert',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80',
      bio: 'Specialized in standardized test preparation with a track record of helping students achieve top scores.',
      social: {
        linkedin: 'https://linkedin.com',
      },
    },
    {
      id: '3',
      name: 'Mark Thompson',
      role: 'Career Coach',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80',
      bio: 'Former corporate recruiter with expertise in career development and professional skill enhancement.',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
      },
    },
    {
      id: '4',
      name: 'Dr. Sarah Kim',
      role: 'Leadership Trainer',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80',
      bio: 'Expert in leadership development with a background in organizational psychology and management.',
      social: {
        linkedin: 'https://linkedin.com',
      },
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
              <h2 className="heading-lg mt-2">Transformative Learning Experiences</h2>
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
            <h2 className="heading-lg mt-2 mb-4">Excellence in Every Aspect</h2>
            <p className="text-muted-foreground">
              Our coaching methodology is built on four key pillars that ensure comprehensive development and lasting results for every student.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Personalized Approach</h3>
              <p className="text-sm text-muted-foreground">
                Customized learning plans tailored to individual strengths, weaknesses, and goals.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Expert Instructors</h3>
              <p className="text-sm text-muted-foreground">
                Learn from industry professionals with extensive experience and proven track records.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Proven Methods</h3>
              <p className="text-sm text-muted-foreground">
                Research-backed teaching methodologies that deliver consistent results.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Holistic Development</h3>
              <p className="text-sm text-muted-foreground">
                Focus on academic excellence alongside personal growth and soft skills.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="section-container">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Testimonials</span>
            <h2 className="heading-lg mt-2 mb-4">What Our Students Say</h2>
            <p className="text-muted-foreground">
              Hear from our students about how Excellence Academy has helped them achieve their goals and transform their lives.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Instructors Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="section-container">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Our Team</span>
            <h2 className="heading-lg mt-2 mb-4">Meet Our Expert Instructors</h2>
            <p className="text-muted-foreground">
              Our dedicated team of instructors brings a wealth of knowledge and experience to help you excel.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructors.map((instructor, index) => (
              <InstructorProfile key={instructor.id} instructor={instructor} index={index} />
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
              <h2 className="heading-lg mt-2 mb-6">Ready to Begin Your Journey?</h2>
              <p className="text-muted-foreground mb-8">
                Reach out to us today to learn more about our programs and how we can help you achieve your goals. Our team is ready to answer any questions you may have.
              </p>
              
              <div className="space-y-6">
                <div className="glass-card p-4 rounded-lg flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Visit Our Center</h3>
                    <p className="text-sm text-muted-foreground">
                      123 Education Lane, Learning City, ED 12345
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
                      +1 (555) 123-4567
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
                      info@excellenceacademy.com
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
