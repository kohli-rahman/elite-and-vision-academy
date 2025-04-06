
import { Eraser, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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
    <div className="glass-card p-4 sm:p-6 rounded-lg w-full overflow-x-hidden">
      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-medium">Question {currentQuestionIndex + 1}</h2>
          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
            {currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'}
          </span>
        </div>
        <div className="mt-2 text-base sm:text-lg break-words">
          <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: currentQuestion.question_text }}></p>
        </div>
      </div>
      
      <div className="mb-6">
        {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options ? (
          <RadioGroup
            value={currentAnswer || ""}
            onValueChange={(value) => updateAnswer(currentQuestion.id, value)}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index}
                className={`p-3 border rounded-lg transition-colors break-words ${
                  currentAnswer === index.toString() 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <RadioGroupItem 
                    value={index.toString()} 
                    id={`option-${index}`}
                    className="mt-1 flex-shrink-0"
                  />
                  <Label 
                    htmlFor={`option-${index}`}
                    className="cursor-pointer flex-grow text-sm sm:text-base whitespace-pre-wrap"
                  >
                    <span dangerouslySetInnerHTML={{ __html: option }}></span>
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>
        ) : currentQuestion.question_type === 'true_false' ? (
          <RadioGroup
            value={currentAnswer || ""}
            onValueChange={(value) => updateAnswer(currentQuestion.id, value)}
            className="space-y-3"
          >
            <div 
              className={`p-3 border rounded-lg transition-colors ${
                currentAnswer === 'true' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem 
                  value="true" 
                  id="option-true"
                />
                <Label 
                  htmlFor="option-true"
                  className="cursor-pointer flex-grow"
                >
                  True
                </Label>
              </div>
            </div>
            <div 
              className={`p-3 border rounded-lg transition-colors ${
                currentAnswer === 'false' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem 
                  value="false" 
                  id="option-false"
                />
                <Label 
                  htmlFor="option-false"
                  className="cursor-pointer flex-grow"
                >
                  False
                </Label>
              </div>
            </div>
          </RadioGroup>
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
          size="sm"
          className="px-2 sm:px-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1 sm:mr-2" />
          <span className="sm:inline">Previous</span>
        </Button>
        
        {currentQuestionIndex < totalQuestions - 1 ? (
          <Button 
            onClick={goToNextQuestion}
            size="sm"
            className="px-2 sm:px-4"
          >
            <span className="sm:inline">Next</span>
            <ChevronRight className="h-4 w-4 ml-1 sm:ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmitTest}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 px-2 sm:px-4"
            size="sm"
          >
            {isSubmitting ? (
              <>
                <div className="spinner spinner-sm mr-2" />
                <span className="sm:inline">Submitting...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="sm:inline">Submit</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
