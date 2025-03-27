
import { useState } from 'react';
import { Linkedin, Twitter } from 'lucide-react';

export type InstructorType = {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  social: {
    linkedin?: string;
    twitter?: string;
  };
};

interface InstructorProfileProps {
  instructor: InstructorType;
  index: number;
}

const InstructorProfile = ({ instructor, index }: InstructorProfileProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="animate-slide-up"
      style={{ animationDelay: `${0.1 + index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-xl aspect-[3/4] mb-4">
        <img 
          src={instructor.image} 
          alt={instructor.name} 
          className={`h-full w-full object-cover transition-transform duration-700 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />
        
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="p-6 w-full">
            <div className="flex gap-2 justify-center">
              {instructor.social.linkedin && (
                <a 
                  href={instructor.social.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-9 w-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {instructor.social.twitter && (
                <a 
                  href={instructor.social.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-9 w-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold">{instructor.name}</h3>
      <p className="text-sm text-primary font-medium">{instructor.role}</p>
      <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{instructor.bio}</p>
    </div>
  );
};

export default InstructorProfile;
