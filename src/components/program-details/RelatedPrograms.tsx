
import React from 'react';
import { Link } from 'react-router-dom';
import programsData, { Program, ProgramsData } from '@/data/programsData';

interface RelatedProgramsProps {
  currentProgramId: string;
}

const RelatedPrograms = ({ currentProgramId }: RelatedProgramsProps) => {
  const getRelatedPrograms = () => {
    return Object.entries(programsData)
      .filter(([key]) => key !== currentProgramId && key.includes(currentProgramId?.split('-')[0] || ''))
      .slice(0, 3)
      .map(([key, program]) => ({ id: key, program }));
  };

  const relatedPrograms = getRelatedPrograms();

  return (
    <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
      <div className="section-container">
        <h2 className="heading-lg text-center mb-12">Explore Related Programs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedPrograms.map(({ id, program }) => (
            <div key={id} className="glass-card rounded-xl overflow-hidden">
              <img 
                src={program.image} 
                alt={program.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {program.description}
                </p>
                <Link to={`/programs/${id}`} className="btn-secondary w-full">
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedPrograms;
