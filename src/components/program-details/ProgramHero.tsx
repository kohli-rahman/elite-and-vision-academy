
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Award, BookOpen, ArrowLeft } from 'lucide-react';
import { Program } from '@/data/programsData';

interface ProgramHeroProps {
  program: Program;
}

const ProgramHero = ({ program }: ProgramHeroProps) => {
  return (
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
  );
};

export default ProgramHero;
