
import { MinusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type QuestionOptionProps = {
  index: number;
  option: string;
  correct: boolean;
  questionId: string;
  canRemove: boolean;
  onOptionChange: (questionId: string, index: number, value: string) => void;
  onCorrectAnswerChange: (questionId: string, answer: string) => void;
  onRemoveOption: (questionId: string, index: number) => void;
};

const QuestionOption = ({
  index,
  option,
  correct,
  questionId,
  canRemove,
  onOptionChange,
  onCorrectAnswerChange,
  onRemoveOption
}: QuestionOptionProps) => {
  return (
    <div className="flex items-center gap-2 mt-2">
      <input 
        type="radio" 
        name={`q-${questionId}-correct`}
        checked={correct}
        onChange={() => onCorrectAnswerChange(questionId, option)}
        className="mr-1"
      />
      <Input 
        value={option}
        onChange={(e) => onOptionChange(questionId, index, e.target.value)}
        placeholder={`Option ${index + 1}`}
        required
      />
      {canRemove && (
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => onRemoveOption(questionId, index)}
          className="text-destructive hover:text-destructive/80"
        >
          <MinusCircle className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default QuestionOption;
