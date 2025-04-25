
import { useEffect } from 'react';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-50 to-blue-50 py-20">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">About Us</span>
            <h1 className="heading-lg mt-2 mb-6">Our Story & Mission</h1>
            <p className="text-lg text-muted-foreground">
              Elite & Vision Academy was founded with a simple yet powerful vision: to provide exceptional coaching that transforms lives and unlocks potential.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Our Mission</span>
              <h2 className="heading-md mt-2 mb-4">Empowering Through Education</h2>
              <p className="text-muted-foreground mb-4">
                At Elite & Vision Academy, our mission is to provide transformative educational experiences that empower students to achieve their full potential, both academically and personally.
              </p>
              <p className="text-muted-foreground mb-4">
                We believe that every student has unique talents and abilities, and our personalized approach to coaching helps uncover and nurture these strengths. By combining academic excellence with character development, we prepare our students not just for exams, but for life.
              </p>
              <p className="text-muted-foreground">
                Our commitment to excellence, integrity, and innovation drives everything we do, from curriculum development to teaching methodologies.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur"></div>
                <div className="glass-card rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80" 
                    alt="Our mission in action" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100/30 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-100/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="section-container relative">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Our Values</span>
            <h2 className="heading-lg mt-2 mb-4">Principles That Guide Us</h2>
            <p className="text-muted-foreground">
              Our core values define who we are and how we approach education. They are the foundation of our coaching philosophy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-8 rounded-xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-xl font-semibold mb-4">Excellence</h3>
              <p className="text-muted-foreground">
                We pursue excellence in everything we do, from our teaching methods to our student support. We constantly strive to improve and innovate, ensuring that our students receive the highest quality education.
              </p>
            </div>
            
            <div className="glass-card p-8 rounded-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xl font-semibold mb-4">Integrity</h3>
              <p className="text-muted-foreground">
                We uphold the highest standards of integrity in all our interactions. Honesty, transparency, and ethical conduct are non-negotiable values that guide our relationships with students, parents, and colleagues.
              </p>
            </div>
            
            <div className="glass-card p-8 rounded-xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-xl font-semibold mb-4">Empowerment</h3>
              <p className="text-muted-foreground">
                We believe in empowering our students to take ownership of their learning journey. We equip them with the knowledge, skills, and confidence to succeed not just in academics, but in all aspects of life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-20 bg-white">
        <div className="section-container">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Our History</span>
            <h2 className="heading-lg mt-2 mb-4">The Elite & Vision Academy Journey</h2>
            <p className="text-muted-foreground">
              From humble beginnings to becoming a leading coaching institute, our journey has been defined by a commitment to educational excellence.
            </p>
          </div>
          
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              <div className="md:col-span-1 text-center md:text-right">
                <span className="text-4xl font-display font-bold text-primary">2010</span>
              </div>
              <div className="md:col-span-4 glass-card p-6 rounded-xl animate-fade-in">
                <h3 className="text-xl font-semibold mb-2">The Beginning</h3>
                <p className="text-muted-foreground">
                  Elite & Vision Academy was founded by Sanjay Sir(Director), Abhishek Sir(Founder) and Rahul Sir(Chairman)  with a small team of dedicated educators. Starting with just two classrooms and a handful of students, we focused on providing personalized academic coaching.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              <div className="md:col-span-1 text-center md:text-right">
                <span className="text-4xl font-display font-bold text-primary">2015</span>
              </div>
              <div className="md:col-span-4 glass-card p-6 rounded-xl animate-fade-in">
                <h3 className="text-xl font-semibold mb-2">Expansion & Growth</h3>
                <p className="text-muted-foreground">
                  After seeing remarkable success with our initial programs, we expanded our offerings to include test preparation and career development. Our student body grew significantly, and we moved to a larger facility.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              <div className="md:col-span-1 text-center md:text-right">
                <span className="text-4xl font-display font-bold text-primary">2018</span>
              </div>
              <div className="md:col-span-4 glass-card p-6 rounded-xl animate-fade-in">
                <h3 className="text-xl font-semibold mb-2">Innovation & Technology</h3>
                <p className="text-muted-foreground">
                  Recognizing the importance of technology in education, we integrated digital learning tools and platforms into our coaching methodology. This allowed us to provide more flexible learning options and reach students beyond our physical location.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              <div className="md:col-span-1 text-center md:text-right">
                <span className="text-4xl font-display font-bold text-primary">2023</span>
              </div>
              <div className="md:col-span-4 glass-card p-6 rounded-xl animate-fade-in">
                <h3 className="text-xl font-semibold mb-2">Present & Future</h3>
                <p className="text-muted-foreground">
                  Today, Elite & Vision Academy stands as a premier coaching institute with a proven track record of success. We continue to evolve and adapt to meet the changing needs of students, while staying true to our core mission of empowering through education.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-purple-500/10">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="heading-lg mb-6">Ready to Join Elite & Vision Academy?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Take the first step towards academic excellence and personal growth. Explore our programs and discover how we can help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/programs" className="btn-primary">
                Explore Programs
              </a>
              <a href="/contact" className="btn-secondary">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
