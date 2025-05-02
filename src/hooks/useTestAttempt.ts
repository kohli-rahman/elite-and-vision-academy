
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
  const [initialTimeLeft, setInitialTimeLeft] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [autoSubmitTriggered, setAutoSubmitTriggered] = useState(false);
  const [loadingAttempted, setLoadingAttempted] = useState(false);

  // Use the extracted utility hooks
  const { 
    answers, 
    unsavedChanges, 
    updateAnswer, 
    resetUnsavedChanges 
  } = useAnswerManagement(questions.map(q => ({ questionId: q.id, answer: null })));

  // Initialize data
  useEffect(() => {
    const fetchTestData = async () => {
      if (!testId || !attemptId) {
        setError("Missing test ID or attempt ID");
        setIsLoading(false);
        return;
      }
      
      if (!userId) {
        // Wait for user ID to be available
        return;
      }

      try {
        console.log("Starting fetchTestData with:", { testId, attemptId, userId });
        setIsLoading(true);
        setError(null);
        
        console.log("Fetching test data for testId:", testId, "attemptId:", attemptId, "userId:", userId);
        const result = await loadTestData(testId, attemptId, userId);
        console.log("Test data result:", result);
        
        if (result.redirectToResults) {
          console.log("Redirecting to results page");
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
          console.log("Time is up, automatically submitting");
          submitTest(true);
          return;
        }
        
        setInitialTimeLeft(result.timeLeft);
        setShowStudentDetailsForm(result.attemptData.student_name ? false : true);
        console.log("Student details form showing:", result.attemptData.student_name ? false : true);
        setIsLoading(false);
      } catch (error: any) {
        console.error("Error loading test data:", error);
        setError(`Error loading test: ${error.message}`);
        setIsLoading(false);
        toast.error(`Error loading test: ${error.message}`);
      } finally {
        setLoadingAttempted(true);
      }
    };

    if (userId && testId && attemptId && !loadingAttempted) {
      console.log("Conditions met, calling fetchTestData");
      fetchTestData();
    } else if (!userId) {
      console.log("Waiting for userId to be available before fetching test data");
    } else {
      console.log("Not fetching test data. Current state:", { 
        userId, 
        testId, 
        attemptId, 
        loadingAttempted 
      });
    }
  }, [testId, attemptId, userId, navigate, updateAnswer, resetUnsavedChanges, loadingAttempted]);

  const handleTimeExpired = useCallback(() => {
    console.log("Time expired callback triggered");
    if (!autoSubmitTriggered && !isSubmitting) {
      console.log("Auto-submission process started");
      setAutoSubmitTriggered(true);
      toast.info("Time's up! Submitting your test...");
      
      // Ensure we save and submit without waiting for user confirmation
      submitTest(true);
    }
  }, [autoSubmitTriggered, isSubmitting]);

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
    if (!test || !attempt || !attemptId) return;
    
    console.log("Submitting test, isTimeUp:", isTimeUp);
    
    // Prevent double submission
    if (isSubmitting) {
      console.log("Submission already in progress, ignoring request");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // First save all current answers
      console.log("Saving all answers before submission");
      await saveAnswers(attemptId, answers);
      resetUnsavedChanges();
      
      console.log("Evaluating and submitting test");
      await evaluateAndSubmitTest(attemptId, test, questions, answers);

      if (isTimeUp) {
        toast.info('Time\'s up! Your test has been submitted automatically.');
      } else {
        toast.success('Test submitted successfully!');
      }
      
      // Navigate to results page
      console.log(`Redirecting to results page: /tests/${testId}/results?attemptId=${attemptId}`);
      navigate(`/tests/${testId}/results?attemptId=${attemptId}`);
    } catch (error: any) {
      console.error("Error submitting test:", error);
      toast.error(`Error submitting test: ${error.message}`);
      setIsSubmitting(false);
    }
  }, [test, attempt, attemptId, isSubmitting, questions, answers, resetUnsavedChanges, navigate, testId]);

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
    error,
    setCurrentQuestion,
    updateAnswer,
    saveAllAnswers,
    submitTest,
    goToNextQuestion,
    goToPrevQuestion,
    completeStudentDetails,
  };
};
