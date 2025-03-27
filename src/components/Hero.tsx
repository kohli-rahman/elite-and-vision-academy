
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50" />
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-blue-100/30 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-indigo-100/30 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="section-container pt-24 md:pt-32 flex flex-col md:flex-row items-center">
        <div className={`md:w-1/2 mb-12 md:mb-0 ${isLoaded ? 'animate-slide-in' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6">
            <span className="animate-pulse-subtle">Now enrolling for 2023</span>
          </div>
          <h1 className="heading-xl mb-6 text-balance">
            Unlocking Potential Through <span className="text-primary">Excellence</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg">
            At Excellence Academy, we nurture talent and foster growth with personalized coaching programs designed to bring out your best.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/programs" className="btn-primary">
              Explore Programs
            </Link>
            <Link to="/about" className="btn-secondary flex items-center">
              Learn More <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className={`md:w-1/2 ${isLoaded ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur"></div>
            <div className="glass-card rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80" 
                alt="Students learning together" 
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
