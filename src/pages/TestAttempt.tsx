
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { StudentDetailsForm } from '@/components/test-attempt/StudentDetailsForm';
import { TestHeader } from '@/components/test-attempt/TestHeader';
import { QuestionCard } from '@/components/test-attempt/QuestionCard';
import { QuestionNavigation } from '@/components/test-attempt/QuestionNavigation';
import { useTestAttempt } from '@/hooks/useTestAttempt';
import { useIsMobile } from '@/hooks/use-mobile';

const TestAttempt = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const attemptId = searchParams.get('attemptId');
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [user, setUser] = useState<any>(null);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/auth');
        return;
      }
      setUser(data.session.user);
    };
    
    checkSession();
  }, [navigate]);

  // Add CSS for math formatting
  useEffect(() => {
    // Add CSS for mathematical expressions
    const style = document.createElement('style');
    style.textContent = `
      .math-root {
        position: relative;
        display: inline-flex;
        align-items: center;
      }
      .math-root:before {
        content: "";
        border-top: 1px solid currentColor;
        position: absolute;
        top: 0;
        left: 0.7em;
        right: 0;
      }
      .math-root-symbol {
        margin-right: 2px;
      }
      .fraction {
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        margin: 0 0.2em;
      }
      .numerator, .denominator {
        display: block;
      }
      .numerator {
        border-bottom: 1px solid;
        padding: 0 3px;
      }
      .denominator {
        padding: 0 3px;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const {
    test,
    questions,
    answers,
    currentQuestion,
    timeLeft,
    isSubmitting,
    isLoading,
    unsavedChanges,
    showStudentDetailsForm,
    setCurrentQuestion,
    updateAnswer,
    saveAllAnswers,
    submitTest,
    goToNextQuestion,
    goToPrevQuestion,
    completeStudentDetails
  } = useTestAttempt(id, attemptId, user?.id);

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen section-container">
        <div className="text-center py-12">
          <div className="spinner mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!test || !questions.length) {
    return (
      <div className="pt-16 min-h-screen section-container">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
          <h2 className="mt-4 text-xl font-semibold">Test Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            The test you're looking for doesn't exist or you don't have permission to access it.
          </p>
          <Button onClick={() => navigate('/tests')} className="mt-4">
            Back to Tests
          </Button>
        </div>
      </div>
    );
  }

  if (showStudentDetailsForm) {
    return (
      <StudentDetailsForm 
        attemptId={attemptId} 
        onSubmit={completeStudentDetails} 
      />
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const currentAnswerData = answers.find(
    a => a.questionId === currentQuestionData.id
  )?.answer;
  
  const answeredCount = answers.filter(a => a.answer !== null).length;

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  return (
    <div className="pt-16 min-h-screen pb-12 section-container">
      <TestHeader 
        test={test}
        timeLeft={timeLeft}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
        currentQuestion={currentQuestion}
        unsavedChanges={unsavedChanges}
        onSaveAnswers={saveAllAnswers}
        onToggleNav={isMobile ? toggleNav : undefined}
        showingNav={showNav}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {(!isMobile || !showNav) && (
          <div className="lg:col-span-3">
            <QuestionCard 
              currentQuestion={currentQuestionData}
              currentQuestionIndex={currentQuestion}
              totalQuestions={questions.length}
              currentAnswer={currentAnswerData}
              updateAnswer={updateAnswer}
              goToPrevQuestion={goToPrevQuestion}
              goToNextQuestion={goToNextQuestion}
              submitTest={submitTest}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
        
        {(!isMobile || showNav) && (
          <div className={isMobile ? "col-span-1" : "lg:col-span-1"}>
            <QuestionNavigation 
              questions={questions}
              answers={answers}
              currentQuestion={currentQuestion}
              setCurrentQuestion={(idx) => {
                setCurrentQuestion(idx);
                if (isMobile) setShowNav(false);
              }}
              unsavedChanges={unsavedChanges}
              saveAllAnswers={saveAllAnswers}
              submitTest={submitTest}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TestAttempt;
