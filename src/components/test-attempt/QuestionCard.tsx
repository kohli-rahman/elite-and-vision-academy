
import { Eraser, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type QuestionCardProps = {
  currentQuestion: {
    id: string;
    question_text: string;
    question_type: string;
    options: string[] | null;
    marks: number;
  };
  currentQuestionIndex: number;
  totalQuestions: number;
  currentAnswer: string | null;
  updateAnswer: (questionId: string, answer: string | null) => void;
  goToPrevQuestion: () => void;
  goToNextQuestion: () => void;
  submitTest: () => void;
  isSubmitting: boolean;
};

export const QuestionCard = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  currentAnswer,
  updateAnswer,
  goToPrevQuestion,
  goToNextQuestion,
  submitTest,
  isSubmitting
}: QuestionCardProps) => {
  const handleEraseAnswer = () => {
    updateAnswer(currentQuestion.id, null);
  };

  const handleSubmitTest = () => {
    if (confirm('Are you sure you want to submit this test? You won\'t be able to change your answers after submission.')) {
      submitTest();
    }
  };

  return (
    <div className="glass-card p-6 rounded-lg">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-medium">Question {currentQuestionIndex + 1}</h2>
          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
            {currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'}
          </span>
        </div>
        <p className="mt-2 text-lg">{currentQuestion.question_text}</p>
      </div>
      
      <div className="mb-8">
        {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options ? (
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  currentAnswer === option 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => updateAnswer(currentQuestion.id, option)}
              >
                <input 
                  type="radio" 
                  id={`option-${index}`}
                  name={`question-${currentQuestion.id}`}
                  checked={currentAnswer === option}
                  onChange={() => updateAnswer(currentQuestion.id, option)}
                  className="mr-3"
                />
                <label 
                  htmlFor={`option-${index}`}
                  className="cursor-pointer flex-grow"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        ) : currentQuestion.question_type === 'true_false' ? (
          <div className="space-y-3">
            <div 
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                currentAnswer === 'true' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => updateAnswer(currentQuestion.id, 'true')}
            >
              <input 
                type="radio" 
                id="option-true"
                name={`question-${currentQuestion.id}`}
                checked={currentAnswer === 'true'}
                onChange={() => updateAnswer(currentQuestion.id, 'true')}
                className="mr-3"
              />
              <label 
                htmlFor="option-true"
                className="cursor-pointer flex-grow"
              >
                True
              </label>
            </div>
            <div 
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                currentAnswer === 'false' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => updateAnswer(currentQuestion.id, 'false')}
            >
              <input 
                type="radio" 
                id="option-false"
                name={`question-${currentQuestion.id}`}
                checked={currentAnswer === 'false'}
                onChange={() => updateAnswer(currentQuestion.id, 'false')}
                className="mr-3"
              />
              <label 
                htmlFor="option-false"
                className="cursor-pointer flex-grow"
              >
                False
              </label>
            </div>
          </div>
        ) : (
          <p>Unsupported question type</p>
        )}
        
        {currentAnswer && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleEraseAnswer} 
            className="mt-4"
          >
            <Eraser className="h-4 w-4 mr-2" />
            Erase Selection
          </Button>
        )}
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={goToPrevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        {currentQuestionIndex < totalQuestions - 1 ? (
          <Button onClick={goToNextQuestion}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmitTest}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
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
        )}
      </div>
    </div>
  );
};
