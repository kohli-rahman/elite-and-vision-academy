
import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ClockIcon, ChevronRight, ChevronLeft, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

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

const TestAttempt = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const attemptId = searchParams.get('attemptId');
  const navigate = useNavigate();
  
  const [user, setUser] = useState<any>(null);
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast.error('Please log in to take tests');
        navigate('/auth');
        return;
      }
      setUser(data.session.user);
    };
    
    checkSession();
  }, [navigate]);

  useEffect(() => {
    const loadTestData = async () => {
      if (!id || !attemptId || !user) return;

      try {
        // First, get the attempt to verify it belongs to the user
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

        if (attemptData.student_id !== user.id) {
          toast.error('You do not have permission to access this attempt');
          navigate('/tests');
          return;
        }

        if (attemptData.status === 'completed') {
          navigate(`/tests/${id}/results?attemptId=${attemptId}`);
          return;
        }

        setAttempt(attemptData);

        // Get the test details
        const { data: testData, error: testError } = await supabase
          .from('tests')
          .select('*')
          .eq('id', attemptData.test_id)
          .single();

        if (testError) throw testError;
        setTest(testData);

        // Get the questions
        const { data: questionsData, error: questionsError } = await supabase
          .from('test_questions')
          .select('*')
          .eq('test_id', testData.id)
          .order('created_at', { ascending: true });

        if (questionsError) throw questionsError;
        setQuestions(questionsData);

        // Initialize answers array
        const initialAnswers = questionsData.map((q: any) => ({
          questionId: q.id,
          answer: null,
        }));
        setAnswers(initialAnswers);

        // Check for existing answers
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
        }

        // Calculate time left
        if (testData && attemptData) {
          const startTime = new Date(attemptData.start_time).getTime();
          const durationMs = testData.duration * 60 * 1000;
          const endTime = startTime + durationMs;
          const now = new Date().getTime();
          const remainingMs = endTime - now;
          
          if (remainingMs <= 0) {
            // Time's up, submit the test
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
  }, [id, attemptId, user, navigate]);

  useEffect(() => {
    // Start the timer
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

  const saveAnswer = async (questionId: string, answer: string) => {
    if (!attemptId) return;

    try {
      // Update local state
      setAnswers(prev => 
        prev.map(a => 
          a.questionId === questionId ? { ...a, answer } : a
        )
      );

      // Check if an answer already exists
      const { data: existingAnswer } = await supabase
        .from('test_answers')
        .select('id')
        .eq('attempt_id', attemptId)
        .eq('question_id', questionId)
        .single();

      if (existingAnswer) {
        // Update existing answer
        await supabase
          .from('test_answers')
          .update({ student_answer: answer })
          .eq('id', existingAnswer.id);
      } else {
        // Create new answer
        await supabase
          .from('test_answers')
          .insert({
            attempt_id: attemptId,
            question_id: questionId,
            student_answer: answer
          });
      }
    } catch (error) {
      console.error('Error saving answer:', error);
      // Continue anyway - we don't want to interrupt the user
    }
  };

  const submitTest = async (isTimeUp = false) => {
    if (!test || !attempt || !attemptId || isSubmitting) return;

    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      // Calculate score
      let score = 0;
      let totalPossible = 0;

      for (const question of questions) {
        totalPossible += question.marks;
        
        const userAnswer = answers.find(a => a.questionId === question.id)?.answer;
        if (!userAnswer) continue;

        // Get correct answer
        const { data: questionData } = await supabase
          .from('test_questions')
          .select('correct_answer')
          .eq('id', question.id)
          .single();

        if (!questionData) continue;

        const isCorrect = userAnswer === questionData.correct_answer;
        if (isCorrect) {
          score += question.marks;
        }

        // Update the answer with correctness
        await supabase
          .from('test_answers')
          .update({ is_correct: isCorrect })
          .eq('attempt_id', attemptId)
          .eq('question_id', question.id);
      }

      // Update the attempt
      await supabase
        .from('test_attempts')
        .update({
          end_time: new Date().toISOString(),
          status: 'completed',
          score,
          total_possible: totalPossible
        })
        .eq('id', attemptId);

      // Navigate to results
      if (isTimeUp) {
        toast.info('Time\'s up! Your test has been submitted automatically.');
      } else {
        toast.success('Test submitted successfully!');
      }
      
      navigate(`/tests/${id}/results?attemptId=${attemptId}`);
    } catch (error: any) {
      toast.error(`Error submitting test: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${secs}s`;
  };

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen section-container">
        <div className="text-center py-12">
          <div className="spinner"></div>
          <p className="mt-4 text-muted-foreground">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!test || !questions.length) {
    return (
      <div className="pt-24 min-h-screen section-container">
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

  const currentQuestionData = questions[currentQuestion];
  const currentAnswer = answers.find(
    a => a.questionId === currentQuestionData.id
  )?.answer;
  
  const answeredCount = answers.filter(a => a.answer !== null).length;

  return (
    <div className="pt-24 min-h-screen pb-12 section-container">
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
                {answeredCount} of {questions.length} questions answered
              </span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Question:</span>
              <span className="ml-2 font-medium">
                {currentQuestion + 1} of {questions.length}
              </span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="glass-card p-6 rounded-lg">
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-medium">Question {currentQuestion + 1}</h2>
                <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {currentQuestionData.marks} {currentQuestionData.marks === 1 ? 'mark' : 'marks'}
                </span>
              </div>
              <p className="mt-2 text-lg">{currentQuestionData.question_text}</p>
            </div>
            
            <div className="mb-8">
              {currentQuestionData.question_type === 'multiple_choice' && currentQuestionData.options ? (
                <div className="space-y-3">
                  {currentQuestionData.options.map((option, index) => (
                    <div 
                      key={index}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        currentAnswer === option 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => saveAnswer(currentQuestionData.id, option)}
                    >
                      <input 
                        type="radio" 
                        id={`option-${index}`}
                        name={`question-${currentQuestionData.id}`}
                        checked={currentAnswer === option}
                        onChange={() => saveAnswer(currentQuestionData.id, option)}
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
              ) : currentQuestionData.question_type === 'true_false' ? (
                <div className="space-y-3">
                  <div 
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      currentAnswer === 'true' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => saveAnswer(currentQuestionData.id, 'true')}
                  >
                    <input 
                      type="radio" 
                      id="option-true"
                      name={`question-${currentQuestionData.id}`}
                      checked={currentAnswer === 'true'}
                      onChange={() => saveAnswer(currentQuestionData.id, 'true')}
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
                    onClick={() => saveAnswer(currentQuestionData.id, 'false')}
                  >
                    <input 
                      type="radio" 
                      id="option-false"
                      name={`question-${currentQuestionData.id}`}
                      checked={currentAnswer === 'false'}
                      onChange={() => saveAnswer(currentQuestionData.id, 'false')}
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
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={goToPrevQuestion}
                disabled={currentQuestion === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              {currentQuestion < questions.length - 1 ? (
                <Button onClick={goToNextQuestion}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={() => {
                    if (confirm('Are you sure you want to submit this test? You won\'t be able to change your answers after submission.')) {
                      submitTest();
                    }
                  }}
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
        </div>
        
        <div className="lg:col-span-1">
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
                  Your answers are saved automatically. Click "Submit Test" when you're done to see your results.
                </p>
              </div>
            </div>
            
            <Button
              className="w-full mt-4 bg-green-600 hover:bg-green-700"
              onClick={() => {
                if (confirm('Are you sure you want to submit this test? You won\'t be able to change your answers after submission.')) {
                  submitTest();
                }
              }}
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
        </div>
      </div>
    </div>
  );
};

export default TestAttempt;
