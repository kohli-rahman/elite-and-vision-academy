
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface BenefitsProps {
  benefits: string[];
}

const Benefits = ({ benefits }: BenefitsProps) => {
  return (
    <div>
      <h2 className="heading-md mb-6">Benefits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits.map((benefit, index) => (
          <div key={index} className="glass-card p-4 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <span>{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Benefits;
