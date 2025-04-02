
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface CurriculumProps {
  curriculum: string[];
}

const Curriculum = ({ curriculum }: CurriculumProps) => {
  return (
    <div className="mb-12">
      <h2 className="heading-md mb-6">Curriculum</h2>
      <div className="glass-card p-6 rounded-xl">
        <ul className="space-y-3">
          {curriculum.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Curriculum;
