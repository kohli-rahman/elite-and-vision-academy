
import { ClockIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

type TestHeaderProps = {
  test: {
    title: string;
    subject: string;
    duration: number;
  };
  timeLeft: number | null;
  answeredCount: number;
  totalQuestions: number;
  currentQuestion: number;
  unsavedChanges: boolean;
  onSaveAnswers: () => void;
};

export const TestHeader = ({
  test,
  timeLeft,
  answeredCount,
  totalQuestions,
  currentQuestion,
  unsavedChanges,
  onSaveAnswers
}: TestHeaderProps) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${secs}s`;
  };

  return (
    <div className="glass-card p-6 rounded-lg mb-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold">{test.title}</h1>
          <p className="text-muted-foreground">{test.subject}</p>
        </div>
        
        <div className="flex items-center gap-2 font-medium">
          <ClockIcon className="h-5 w-5 text-primary" />
          {timeLeft !== null ? (
            <span className={timeLeft < 60 ? "text-destructive animate-pulse" : ""}>
              Time Left: {formatTime(timeLeft)}
            </span>
          ) : (
            <span>Duration: {test.duration} minutes</span>
          )}
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-sm text-muted-foreground">Progress:</span>
            <span className="ml-2 font-medium">
              {answeredCount} of {totalQuestions} questions answered
            </span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Question:</span>
            <span className="ml-2 font-medium">
              {currentQuestion + 1} of {totalQuestions}
            </span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          ></div>
        </div>
        
        {unsavedChanges && (
          <div className="flex justify-end mt-2">
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={onSaveAnswers}
            >
              Save Answers
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
