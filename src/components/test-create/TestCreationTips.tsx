
import { Check } from 'lucide-react';

const TestCreationTips = () => {
  return (
    <div className="glass-card p-6 rounded-lg sticky top-24">
      <h3 className="font-semibold text-lg mb-4">Test Creation Tips</h3>
      <ul className="space-y-3">
        <li className="flex gap-2">
          <Check className="h-5 w-5 text-primary flex-shrink-0" />
          <span>Start with clear test details (title, duration, subject)</span>
        </li>
        <li className="flex gap-2">
          <Check className="h-5 w-5 text-primary flex-shrink-0" />
          <span>Create a mix of multiple-choice and true/false questions</span>
        </li>
        <li className="flex gap-2">
          <Check className="h-5 w-5 text-primary flex-shrink-0" />
          <span>Assign appropriate marks to each question based on difficulty</span>
        </li>
        <li className="flex gap-2">
          <Check className="h-5 w-5 text-primary flex-shrink-0" />
          <span>Use text formatting tools for mathematical expressions (√, π, ∞, etc.)</span>
        </li>
        <li className="flex gap-2">
          <Check className="h-5 w-5 text-primary flex-shrink-0" />
          <span>Use superscript for exponents (x<sup>2</sup>) and subscripts for chemical formulas (H<sub>2</sub>O)</span>
        </li>
        <li className="flex gap-2">
          <Check className="h-5 w-5 text-primary flex-shrink-0" />
          <span>Review all questions before publishing</span>
        </li>
        <li className="flex gap-2">
          <Check className="h-5 w-5 text-primary flex-shrink-0" />
          <span>Set a reasonable passing percentage (typically 50-70%)</span>
        </li>
      </ul>
      
      <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-md">
        <p className="text-amber-800 text-sm">
          <strong>Note:</strong> Keep tests unpublished until they're ready for students. Once published, students will be able to see and take the tests.
        </p>
      </div>
    </div>
  );
};

export default TestCreationTips;
