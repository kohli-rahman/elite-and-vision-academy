
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type QuestionNavigationProps = {
  questions: Array<{ id: string }>;
  answers: Array<{ questionId: string; answer: string | null }>;
  currentQuestion: number;
  setCurrentQuestion: (index: number) => void;
  unsavedChanges: boolean;
  saveAllAnswers: () => void;
  submitTest: () => void;
  isSubmitting: boolean;
};

export const QuestionNavigation = ({
  questions,
  answers,
  currentQuestion,
  setCurrentQuestion,
  unsavedChanges,
  saveAllAnswers,
  submitTest,
  isSubmitting
}: QuestionNavigationProps) => {
  const handleSubmitTest = () => {
    if (confirm('Are you sure you want to submit this test? You won\'t be able to change your answers after submission.')) {
      submitTest();
    }
  };

  return (
    <div className="glass-card p-6 rounded-lg sticky top-24">
      <h3 className="font-semibold mb-4">Questions</h3>
      
      <div className="grid grid-cols-5 gap-2 mb-4">
        {questions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => setCurrentQuestion(idx)}
            className={`h-10 w-10 rounded-full flex items-center justify-center text-sm transition-colors ${
              idx === currentQuestion
                ? 'bg-primary text-white'
                : answers.find(a => a.questionId === q.id)?.answer
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
      
      <div className="flex items-center text-sm text-muted-foreground mb-2">
        <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
        <span>Current Question</span>
      </div>
      
      <div className="flex items-center text-sm text-muted-foreground mb-2">
        <div className="w-3 h-3 rounded-full bg-green-100 border border-green-300 mr-2"></div>
        <span>Answered</span>
      </div>
      
      <div className="flex items-center text-sm text-muted-foreground">
        <div className="w-3 h-3 rounded-full bg-gray-100 mr-2"></div>
        <span>Not Answered</span>
      </div>
      
      <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-md">
        <div className="flex gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <p className="text-amber-800 text-sm">
            Don't forget to save your answers before submitting. Click "Save Answers" if you have unsaved changes.
          </p>
        </div>
      </div>
      
      {unsavedChanges && (
        <Button
          variant="secondary"
          className="w-full mt-4"
          onClick={saveAllAnswers}
        >
          Save Answers
        </Button>
      )}
      
      <Button
        className="w-full mt-4 bg-green-600 hover:bg-green-700"
        onClick={handleSubmitTest}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <div className="spinner spinner-sm mr-2" />
            Submitting...
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Submit Test
          </>
        )}
      </Button>
    </div>
  );
};
