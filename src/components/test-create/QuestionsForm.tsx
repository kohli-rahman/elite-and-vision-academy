
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SingleQuestion from './SingleQuestion';

type QuestionType = {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false';
  options: string[];
  correct_answer: string;
  marks: number;
};

type QuestionsFormProps = {
  questions: QuestionType[];
  activeQuestionId: string | null;
  showFormatting: boolean;
  onAddQuestion: () => void;
  onRemoveQuestion: (id: string) => void;
  onUpdateQuestion: (id: string, field: string, value: any) => void;
  onUpdateOption: (questionId: string, index: number, value: string) => void;
  onAddOption: (questionId: string) => void;
  onRemoveOption: (questionId: string, index: number) => void;
  onSetActiveQuestion: (id: string | null) => void;
  onSetShowFormatting: (show: boolean) => void;
  onInsertFormat: (questionId: string, format: string) => void;
};

const QuestionsForm = ({
  questions,
  activeQuestionId,
  showFormatting,
  onAddQuestion,
  onRemoveQuestion,
  onUpdateQuestion,
  onUpdateOption,
  onAddOption,
  onRemoveOption,
  onSetActiveQuestion,
  onSetShowFormatting,
  onInsertFormat
}: QuestionsFormProps) => {
  return (
    <div className="glass-card p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Test Questions</h2>
        <Button type="button" variant="outline" onClick={onAddQuestion}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>
      
      {questions.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-muted-foreground">No questions added yet.</p>
          <Button type="button" className="mt-4" onClick={onAddQuestion}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Your First Question
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((question, qIndex) => (
            <SingleQuestion
              key={question.id}
              question={question}
              index={qIndex}
              showFormatting={showFormatting}
              activeQuestionId={activeQuestionId}
              onRemoveQuestion={onRemoveQuestion}
              onUpdateQuestion={onUpdateQuestion}
              onUpdateOption={onUpdateOption}
              onAddOption={onAddOption}
              onRemoveOption={onRemoveOption}
              onSetActiveQuestion={onSetActiveQuestion}
              onSetShowFormatting={onSetShowFormatting}
              onInsertFormat={onInsertFormat}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionsForm;
