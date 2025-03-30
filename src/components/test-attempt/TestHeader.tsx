
import { ClockIcon, MenuIcon, XIcon } from 'lucide-react';
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
  onToggleNav?: () => void;
  showingNav?: boolean;
};

export const TestHeader = ({
  test,
  timeLeft,
  answeredCount,
  totalQuestions,
  currentQuestion,
  unsavedChanges,
  onSaveAnswers,
  onToggleNav,
  showingNav
}: TestHeaderProps) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${secs}s`;
  };

  return (
    <div className="glass-card p-4 sm:p-6 rounded-lg mb-6">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold truncate">{test.title}</h1>
          <p className="text-sm text-muted-foreground">{test.subject}</p>
        </div>
        
        {onToggleNav && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleNav}
            className="flex-shrink-0 ml-2"
          >
            {showingNav ? (
              <XIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
            <span className="sr-only">
              {showingNav ? "Hide question list" : "Show question list"}
            </span>
          </Button>
        )}
        
        <div className="flex items-center gap-1 font-medium text-sm sm:text-base whitespace-nowrap">
          <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
          {timeLeft !== null ? (
            <span className={timeLeft < 60 ? "text-destructive animate-pulse" : ""}>
              {formatTime(timeLeft)}
            </span>
          ) : (
            <span>{test.duration}m</span>
          )}
        </div>
      </div>
      
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t">
        <div className="flex flex-wrap justify-between items-center mb-2 sm:mb-4 gap-y-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Progress:</span>
            <span className="ml-2 font-medium">
              {answeredCount}/{totalQuestions}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Question:</span>
            <span className="ml-2 font-medium">
              {currentQuestion + 1}/{totalQuestions}
            </span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full" 
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
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
