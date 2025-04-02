
import React from 'react';
import { FileText } from 'lucide-react';
import { ExamInfo } from '@/data/programsData';

interface ExamInformationProps {
  examInfo: ExamInfo;
}

const ExamInformation = ({ examInfo }: ExamInformationProps) => {
  return (
    <div className="mb-12">
      <h2 className="heading-md mb-6">About the Examination</h2>
      <div className="glass-card p-6 rounded-xl">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FileText className="h-5 w-5 text-primary mr-2" /> {examInfo.name}
          </h3>
          <p className="text-muted-foreground">{examInfo.description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h4 className="font-medium mb-2 text-primary">Examination Structure</h4>
            <p className="text-sm text-muted-foreground">{examInfo.structure}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-primary">Importance</h4>
            <p className="text-sm text-muted-foreground">{examInfo.importance}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInformation;
