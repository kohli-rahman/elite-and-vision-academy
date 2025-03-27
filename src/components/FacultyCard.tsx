
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export type FacultyType = {
  id: string;
  name: string;
  qualification: string;
  experience: string;
  subject: string;
  specialization: string;
  image_url: string;
};

interface FacultyCardProps {
  faculty: FacultyType;
  index: number;
}

const FacultyCard = ({ faculty, index }: FacultyCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="overflow-hidden transition-all duration-300 h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        animationDelay: `${index * 0.1}s`,
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 10px 25px -5px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="relative pt-[75%] overflow-hidden">
        <img
          src={faculty.image_url}
          alt={faculty.name}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700"
          style={{
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
          <h3 className="text-xl font-semibold text-white">{faculty.name}</h3>
          <p className="text-white/90 text-sm">{faculty.subject} Expert</p>
        </div>
      </div>
      <CardContent className="p-5">
        <p className="text-primary font-medium">{faculty.qualification}</p>
        <p className="text-sm text-muted-foreground mt-1">{faculty.experience} of teaching experience</p>
        <div className="mt-3 bg-primary/10 rounded-md px-3 py-2">
          <p className="text-sm text-primary font-medium">Specialization</p>
          <p className="text-xs text-muted-foreground">{faculty.specialization}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacultyCard;
