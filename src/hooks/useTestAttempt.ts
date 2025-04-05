
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type Question = {
  id: string;
  question_text: string;
  question_type: string;
  options: string[] | null;
  marks: number;
};

type Test = {
  id: string;
  title: string;
  description: string;
  subject: string;
  duration: number;
  passing_percent: number;
  negative_marking: boolean;
  negative_marks_percent: number;
};

type Attempt = {
  id: string;
  test_id: string;
  student_id: string;
  start_time: string;
  end_time: string | null;
  status: string;
};

type Answer = {
  questionId: string;
  answer: string | null;
};

export const useTestAttempt = (testId: string | undefined, attemptId: string | null, userId: string | undefined) => {
  const navigate = useNavigate();
  
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showStudentDetailsForm, setShowStudentDetailsForm] = useState(true);

  const timerRef = useRef<any>(null);

  // Helper for parsing options consistently
  const parseOptions = useCallback((options: any): string[] | null => {
    if (!options) return null;
    
    try {
      if (Array.isArray(options)) return options;
      if (typeof options === 'string') return JSON.parse(options);
      return Array.isArray(JSON.parse(JSON.stringify(options))) ? 
        JSON.parse(JSON.stringify(options)) : null;
    } catch (e) {
      console.error("Error parsing options:", e);
      return null;
    }
  }, []);

  useEffect(() => {
    const loadTestData = async () => {
      if (!testId || !attemptId || !userId) return;

      try {
        const { data: attemptData, error: attemptError } = await supabase
          .from('test_attempts')
          .select('*')
          .eq('id', attemptId)
          .single();

        if (attemptError) throw attemptError;
        if (!attemptData) {
          toast.error('Test attempt not found');
          navigate('/tests');
          return;
        }

        if (attemptData.student_id !== userId) {
          toast.error('You do not have permission to access this attempt');
          navigate('/tests');
          return;
        }

        if (attemptData.status === 'completed') {
          navigate(`/tests/${testId}/results?attemptId=${attemptId}`);
          return;
        }

        setAttempt(attemptData);

        const { data: testData, error: testError } = await supabase
          .from('tests')
          .select('*')
          .eq('id', attemptData.test_id)
          .single();

        if (testError) throw testError;
        setTest(testData);

        const { data: questionsData, error: questionsError } = await supabase
          .from('test_questions')
          .select('*')
          .eq('test_id', testData.id)
          .order('created_at', { ascending: true });

        if (questionsError) throw questionsError;
        
        const formattedQuestions: Question[] = questionsData.map((q: any) => ({
          id: q.id,
          question_text: q.question_text,
          question_type: q.question_type,
          options: parseOptions(q.options),
          marks: q.marks,
        }));
        
        setQuestions(formattedQuestions);

        const initialAnswers = questionsData.map((q: any) => ({
          questionId: q.id,
          answer: null,
        }));

        const { data: existingAnswers, error: answersError } = await supabase
          .from('test_answers')
          .select('question_id, student_answer')
          .eq('attempt_id', attemptId);

        if (!answersError && existingAnswers.length > 0) {
          const updatedAnswers = initialAnswers.map(ans => {
            const existing = existingAnswers.find(
              (ea: any) => ea.question_id === ans.questionId
            );
            return existing 
              ? { ...ans, answer: existing.student_answer } 
              : ans;
          });
          setAnswers(updatedAnswers);
        } else {
          setAnswers(initialAnswers);
        }

        if (testData && attemptData) {
          const startTime = new Date(attemptData.start_time).getTime();
          const durationMs = testData.duration * 60 * 1000;
          const endTime = startTime + durationMs;
          const now = new Date().getTime();
          const remainingMs = endTime - now;
          
          if (remainingMs <= 0) {
            submitTest(true);
          } else {
            setTimeLeft(Math.floor(remainingMs / 1000));
          }
        }

        setIsLoading(false);
      } catch (error: any) {
        toast.error(`Error loading test: ${error.message}`);
        navigate('/tests');
      }
    };

    loadTestData();
  }, [testId, attemptId, userId, navigate, parseOptions]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timerRef.current);
            submitTest(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft]);

  const updateAnswer = useCallback((questionId: string, answer: string | null) => {
    setAnswers(prev => 
      prev.map(a => 
        a.questionId === questionId ? { ...a, answer } : a
      )
    );
    setUnsavedChanges(true);
  }, []);

  const saveAllAnswers = useCallback(async () => {
    if (!attemptId) return;

    try {
      const answersToSave = answers.filter(a => a.answer !== null);
      
      // Process in batches to avoid overwhelming the server
      const batchSize = 5;
      for (let i = 0; i < answersToSave.length; i += batchSize) {
        const batch = answersToSave.slice(i, i + batchSize);
        
        const promises = batch.map(async (answer) => {
          const { data: existingAnswer } = await supabase
            .from('test_answers')
            .select('id')
            .eq('attempt_id', attemptId)
            .eq('question_id', answer.questionId)
            .maybeSingle();

          if (existingAnswer) {
            return supabase
              .from('test_answers')
              .update({ student_answer: answer.answer })
              .eq('id', existingAnswer.id);
          } else {
            return supabase
              .from('test_answers')
              .insert({
                attempt_id: attemptId,
                question_id: answer.questionId,
                student_answer: answer.answer
              });
          }
        });
        
        await Promise.all(promises);
      }
      
      setUnsavedChanges(false);
      toast.success('Answers saved successfully');
    } catch (error) {
      console.error('Error saving answers:', error);
      toast.error('Failed to save answers');
    }
  }, [attemptId, answers]);

  const submitTest = useCallback(async (isTimeUp = false) => {
    if (!test || !attempt || !attemptId || isSubmitting) return;

    await saveAllAnswers();
    
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      let score = 0;
      let totalPossible = 0;
      let negativeMarks = 0;
      
      // Process question evaluations in batches
      for (const question of questions) {
        totalPossible += question.marks;
        
        const userAnswer = answers.find(a => a.questionId === question.id)?.answer;
        if (!userAnswer) continue;

        const { data: questionData } = await supabase
          .from('test_questions')
          .select('correct_answer')
          .eq('id', question.id)
          .single();

        if (!questionData) continue;

        const isCorrect = userAnswer === questionData.correct_answer;
        if (isCorrect) {
          score += question.marks;
        } else if (test.negative_marking && userAnswer) {
          const deduction = (question.marks * test.negative_marks_percent) / 100;
          negativeMarks += deduction;
        }

        await supabase
          .from('test_answers')
          .update({ is_correct: isCorrect })
          .eq('attempt_id', attemptId)
          .eq('question_id', question.id);
      }

      await supabase
        .from('test_attempts')
        .update({
          end_time: new Date().toISOString(),
          status: 'completed',
          score,
          negative_marks: negativeMarks,
          total_possible: totalPossible
        })
        .eq('id', attemptId);

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
