
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Answer,
  Question,
  Test,
  Attempt, 
  loadTestData,
  saveAnswers
} from './test-attempt/testAttemptService';
import { useTestTimer } from './test-attempt/timerUtils';
import { evaluateAndSubmitTest } from './test-attempt/testEvaluation';
import { useAnswerManagement } from './test-attempt/answerUtils';

export const useTestAttempt = (testId: string | undefined, attemptId: string | null, userId: string | undefined) => {
  const navigate = useNavigate();
  
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showStudentDetailsForm, setShowStudentDetailsForm] = useState(true);

  // Use the extracted utility hooks
  const { 
    answers, 
    unsavedChanges, 
    updateAnswer, 
    resetUnsavedChanges 
  } = useAnswerManagement([]);

  // Initialize data
  useEffect(() => {
    const fetchTestData = async () => {
      if (!testId || !attemptId || !userId) return;

      try {
        setIsLoading(true);
        const result = await loadTestData(testId, attemptId, userId);
        
        if (result.redirectToResults) {
          navigate(`/tests/${testId}/results?attemptId=${attemptId}`);
          return;
        }
        
        setTest(result.testData);
        setQuestions(result.formattedQuestions);
        setAttempt(result.attemptData);
        
        // Initialize answers through the hook
        result.finalAnswers.forEach(answer => {
          if (answer.answer !== null) {
            updateAnswer(answer.questionId, answer.answer);
          }
        });
        resetUnsavedChanges();
        
        // If time is up, automatically submit
        if (result.timeIsUp) {
          submitTest(true);
          return;
        }
        
        setInitialTimeLeft(result.timeLeft);
        setIsLoading(false);
      } catch (error: any) {
        toast.error(`Error loading test: ${error.message}`);
        navigate('/tests');
      }
    };

    fetchTestData();
  }, [testId, attemptId, userId, navigate, updateAnswer, resetUnsavedChanges]);

  // Timer management
  const [initialTimeLeft, setInitialTimeLeft] = useState<number | null>(null);
  
  const handleTimeExpired = useCallback(() => {
    submitTest(true);
  }, []);

  const { timeLeft } = useTestTimer(initialTimeLeft, handleTimeExpired);

  // Save answers
  const saveAllAnswers = useCallback(async () => {
    if (!attemptId) return;

    try {
      await saveAnswers(attemptId, answers);
      resetUnsavedChanges();
      toast.success('Answers saved successfully');
    } catch (error) {
      console.error('Error saving answers:', error);
      toast.error('Failed to save answers');
    }
  }, [attemptId, answers, resetUnsavedChanges]);

  // Submit test
  const submitTest = useCallback(async (isTimeUp = false) => {
    if (!test || !attempt || !attemptId || isSubmitting) return;

    await saveAllAnswers();
    
    setIsSubmitting(true);

    try {
      await evaluateAndSubmitTest(attemptId, test, questions, answers);

      if (isTimeUp) {
        toast.info('Time\'s up! Your test has been submitted automatically.');
      } else {
        toast.success('Test submitted successfully!');
      }
      
      navigate(`/tests/${testId}/results?attemptId=${attemptId}`);
    } catch (error: any) {
      toast.error(`Error submitting test: ${error.message}`);
      setIsSubmitting(false);
    }
  }, [test, attempt, attemptId, isSubmitting, questions, answers, saveAllAnswers, navigate, testId]);

  // Navigation
  const goToNextQuestion = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  }, [currentQuestion, questions.length]);

  const goToPrevQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }, [currentQuestion]);

  const completeStudentDetails = useCallback(() => {
    setShowStudentDetailsForm(false);
  }, []);

  return {
    test,
    questions,
    attempt,
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
    completeStudentDetails,
  };
};
