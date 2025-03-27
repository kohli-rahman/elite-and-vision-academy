
import { useState } from 'react';
import { Clock, Users, Award, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export type ProgramType = {
  id: string;
  title: string;
  description: string;
  duration: string;
  groupSize: string;
  level: string;
  image: string;
};

interface ProgramCardProps {
  program: ProgramType;
  index: number;
}

const ProgramCard = ({ program, index }: ProgramCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group animate-slide-up rounded-xl overflow-hidden glass-card"
      style={{ animationDelay: `${0.1 + index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={program.image} 
          alt={program.title} 
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      
      <div className="p-6">
        <div className="mb-4 flex justify-between items-start">
          <h3 className="heading-sm text-balance">{program.title}</h3>
        </div>
        
        <p className="text-muted-foreground mb-6 line-clamp-2">
          {program.description}
        </p>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{program.duration}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{program.groupSize}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Award className="h-4 w-4" />
            <span>{program.level}</span>
          </div>
        </div>
        
        <Link 
          to={`/programs/${program.id}`}
          className="inline-flex items-center text-primary font-medium text-sm group-hover:gap-1.5 gap-1 transition-all"
        >
          View Program <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};

export default ProgramCard;
