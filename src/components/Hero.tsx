
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, BookOpen, Award, Users, BarChart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setIsLoaded(true);
    
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50" />
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-blue-100/30 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-indigo-100/30 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="section-container pt-24 md:pt-32 flex flex-col md:flex-row items-center">
        <div className={`md:w-1/2 mb-12 md:mb-0 ${isLoaded ? 'animate-slide-in' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6">
            <span className="animate-pulse-subtle">Admissions Open 2025-26</span>
          </div>
          <h1 className="heading-xl mb-6 text-balance">
            Unlock Your <span className="text-primary">Academic Potential</span> with Elite & Vision Academy
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg">
            Expert coaching for CBSE, ICSE Board Exams and competitive exams like 
            <span className="text-primary font-medium"> NTSE, IIT-JEE, NEET </span> 
            with personalized attention and proven results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {session ? (
              <Link to="/admission" className="btn-primary">
                Apply for Admission
              </Link>
            ) : (
              <Link to="/auth" className="btn-primary">
                Register Now
              </Link>
            )}
            <Link to="/programs" className="btn-secondary flex items-center">
              Explore Programs <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-bold">800+</span>
              <span className="text-xs text-muted-foreground">Students</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-bold">25+</span>
              <span className="text-xs text-muted-foreground">Expert Faculty</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-bold">95%</span>
              <span className="text-xs text-muted-foreground">Success Rate</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-bold">150+</span>
              <span className="text-xs text-muted-foreground">Top Ranks</span>
            </div>
          </div>
        </div>

        <div className={`md:w-1/2 ${isLoaded ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur"></div>
            <div className="glass-card rounded-xl overflow-hidden">
              
               <img src="https://idcgmeemtrhjknobwxik.supabase.co/storage/v1/object/public/faculty/WhatsApp%20Image%202025-05-07%20at%2014.15.36%20(1).jpeg" />

                alt="Students studying in a classroom" 
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
