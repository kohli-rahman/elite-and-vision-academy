
import React from 'react';
import { BookOpen } from 'lucide-react';
import { Subject } from '@/data/programsData';

interface SubjectsTopicsProps {
  subjects: Subject[];
}

const SubjectsTopics = ({ subjects }: SubjectsTopicsProps) => {
  return (
    <div className="mb-12">
      <h2 className="heading-md mb-6">Subjects & Topics Covered</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((subject, index) => (
          <div key={index} className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <BookOpen className="h-5 w-5 text-primary mr-2" /> {subject.name}
            </h3>
            <ul className="space-y-2">
              {subject.topics.map((topic, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectsTopics;
