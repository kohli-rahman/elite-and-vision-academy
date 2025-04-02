
import React from 'react';
import { Program } from '@/data/programsData';

interface ProgramOverviewProps {
  program: Program;
}

const ProgramOverview = ({ program }: ProgramOverviewProps) => {
  return (
    <div className="mb-12">
      <h2 className="heading-md mb-6">Program Overview</h2>
      {program.longDescription.map((paragraph, index) => (
        <p key={index} className="text-muted-foreground mb-4">
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default ProgramOverview;
