import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, XCircle, AlertCircle, 
  Award, BarChart, Clock, BookOpen, Users, BarChart2, ListFilter
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TestResult = {
  test: {
    id: string;
    title: string;
    description: string;
    subject: string;
    duration: number;
    passing_percent: number;
  };
  attempt: {
    id: string;
    start_time: string;
    end_time: string;
    score: number;
    total_possible: number;
    status: string;
    negative_marks: number;
  };
  answers: {
    question_id: string;
    question_text: string;
    question_type: string;
    options: string[] | null;
    marks: number;
    student_answer: string;
    correct_answer: string;
    is_correct: boolean;
  }[];
  totalQuestions: number;
  correctAnswers: number;
  percentageScore: number;
  passed: boolean;
  timeTaken: string;
};

type RankingEntry = {
  rank: number;
  student_name: string;
  student_email: string;
  score: number;
  total_possible: number;
  percentage: number;
  negative_marks: number;
  attempt_id: string;
};

const TestResults = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const attemptId = searchParams.get('attemptId');
  const navigate = useNavigate();
  
  const [user, setUser] = useState<any>(null);
  const [result, setResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFaculty, setIsFaculty] = useState(false);
  const [showAllResults, setShowAllResults] = useState(false);
  const [allAttempts, setAllAttempts] = useState<any[]>([]);
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [showRankings, setShowRankings] = useState(false);
  const [rankingsLoading, setRankingsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast.error('Please log in to view test results');
        navigate('/auth');
        return;
      }
      setUser(data.session.user);
      
      setIsFaculty(true);
    };
    
    checkSession();
  }, [navigate]);

  useEffect(() => {
    const loadResults = async () => {
      if (!id || !user) return;
      
      try {
        setIsLoading(true);
        
        if (attemptId) {
          await loadAttemptResults(attemptId);
        } 
        else if (isFaculty) {
          const { data: attempts, error: attemptsError } = await supabase
            .from('test_attempts')
            .select(`
              id, 
              start_time, 
              end_time, 
              score, 
              negative_marks,
              total_possible, 
              status,
              profiles:student_id (full_name)
            `)
            .eq('test_id', id)
            .order('created_at', { ascending: false });
          
          if (attemptsError) throw attemptsError;
          setAllAttempts(attempts);
          setShowAllResults(true);
        } 
        else {
          const { data: attempt, error: attemptError } = await supabase
            .from('test_attempts')
            .select('id')
            .eq('test_id', id)
            .eq('student_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          if (attemptError) {
            toast.error('You have not taken this test yet');
            navigate('/tests');
            return;
          }
          
          await loadAttemptResults(attempt.id);
        }
        
        setIsLoading(false);
      } catch (error: any) {
        toast.error(`Error loading results: ${error.message}`);
        navigate('/tests');
      }
    };
    
    loadResults();
  }, [id, attemptId, user, isFaculty, navigate]);

  const loadAttemptResults = async (attemptId: string) => {
    const { data: test, error: testError } = await supabase
      .from('tests')
      .select('*')
      .eq('id', id)
      .single();
    
    if (testError) throw testError;
    
    const { data: attempt, error: attemptError } = await supabase
      .from('test_attempts')
      .select('*')
      .eq('id', attemptId)
      .single();
    
    if (attemptError) throw attemptError;
    
    const { data: answers, error: answersError } = await supabase
      .from('test_answers')
      .select(`
        id,
        question_id,
        student_answer,
        is_correct,
        questions:test_questions(
          id,
          question_text,
          question_type,
          options,
          correct_answer,
          marks
        )
      `)
      .eq('attempt_id', attemptId);
    
    if (answersError) throw answersError;
    
    const formattedAnswers = answers.map((answer: any) => ({
      question_id: answer.question_id,
      question_text: answer.questions.question_text,
      question_type: answer.questions.question_type,
      options: answer.questions.options,
      marks: answer.questions.marks,
      student_answer: answer.student_answer,
      correct_answer: answer.questions.correct_answer,
      is_correct: answer.is_correct,
    }));
    
    const correctAnswers = formattedAnswers.filter((a: any) => a.is_correct).length;
    const percentageScore = attempt.total_possible 
      ? Math.round((attempt.score - (attempt.negative_marks || 0)) / attempt.total_possible * 100) 
      : 0;
    
    const startTime = new Date(attempt.start_time);
    const endTime = attempt.end_time ? new Date(attempt.end_time) : new Date();
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const timeTaken = `${Math.floor(diffMins / 60)}h ${diffMins % 60}m`;
    
    setResult({
      test,
      attempt,
      answers: formattedAnswers,
      totalQuestions: formattedAnswers.length,
      correctAnswers,
      percentageScore,
      passed: percentageScore >= test.passing_percent,
      timeTaken,
    });
    
    setShowAllResults(false);
  };

  const loadRankings = async () => {
    if (!id) return;
    
    try {
      setRankingsLoading(true);
      
      const { data: attempts, error: attemptsError } = await supabase
        .from('test_attempts')
        .select(`
          id, 
          student_id,
          score, 
          negative_marks,
          total_possible,
          profiles:student_id (full_name)
        `)
        .eq('test_id', id)
        .eq('status', 'completed')
        .order('score', { ascending: false });
      
      if (attemptsError) throw attemptsError;
      
      const rankingsData: RankingEntry[] = attempts.map((attempt: any, index: number) => {
        const percentage = attempt.total_possible ? 
          Math.round(((attempt.score - (attempt.negative_marks || 0)) / attempt.total_possible) * 100) : 0;
        
        let studentEmail = "Hidden";
        if (attempt.student_id === user?.id) {
          studentEmail = user.email;
        } else if (isFaculty) {
          studentEmail = `student${index+1}@example.com`;
        }
        
        return {
          rank: index + 1,
          student_name: attempt.profiles?.full_name || 'Unknown Student',
          student_email: studentEmail,
          score: attempt.score || 0,
          negative_marks: attempt.negative_marks || 0,
          total_possible: attempt.total_possible || 0,
          percentage,
          attempt_id: attempt.id
        };
      });
      
      setRankings(rankingsData);
      setShowRankings(true);
      setRankingsLoading(false);
    } catch (error: any) {
      toast.error(`Error loading rankings: ${error.message}`);
      setRankingsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen section-container">
        <div className="text-center py-12">
          <div className="spinner"></div>
          <p className="mt-4 text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  if (showAllResults) {
    return (
      <div className="pt-24 min-h-screen pb-12 section-container">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/tests')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tests
        </Button>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="heading-lg">Test Results</h1>
            <p className="text-muted-foreground">
              View all student attempts for this test
            </p>
          </div>
        </div>
        
        {allAttempts.length === 0 ? (
          <div className="glass-card p-10 rounded-lg text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-amber-500" />
            <h3 className="mt-4 text-lg font-medium">No Attempts Yet</h3>
            <p className="mt-2 text-muted-foreground">
              No students have attempted this test yet.
            </p>
            <Button onClick={() => navigate('/tests')} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tests
            </Button>
          </div>
        ) : (
          <div className="glass-card rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allAttempts.map((attempt) => {
                  const score = attempt.score || 0;
                  const total = attempt.total_possible || 1;
                  const percentage = Math.round((score / total) * 100);
                  
                  return (
                    <TableRow key={attempt.id}>
                      <TableCell className="font-medium">
                        {attempt.profiles?.full_name || 'Unknown Student'}
                      </TableCell>
                      <TableCell>
                        {new Date(attempt.start_time).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {score} / {total}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-24">
                            <div 
                              className={`h-2.5 rounded-full ${
                                percentage >= 70 
                                  ? 'bg-green-600' 
                                  : percentage >= 40 
                                  ? 'bg-amber-500' 
                                  : 'bg-red-500'
                              }`} 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span>{percentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          attempt.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {attempt.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => loadAttemptResults(attempt.id)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    );
  }

  if (!result) {
    return (
      <div className="pt-24 min-h-screen section-container">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
          <h2 className="mt-4 text-xl font-semibold">Results Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            The test results you're looking for don't exist or you don't have permission to view them.
          </p>
          <Button onClick={() => navigate('/tests')} className="mt-4">
            Back to Tests
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen pb-12 section-container">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/tests')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Tests
      </Button>

      {isFaculty && (
        <Button
          variant="outline"
          className="mb-6 ml-4"
          onClick={() => setShowAllResults(true)}
        >
          <BarChart className="mr-2 h-4 w-4" />
          View All Attempts
        </Button>
      )}

      <Tabs defaultValue="results" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="results">Your Results</TabsTrigger>
          <TabsTrigger 
            value="rankings" 
            onClick={() => {
              if (!showRankings && !rankingsLoading) {
                loadRankings();
              }
            }}
          >Student Rankings</TabsTrigger>
        </TabsList>

        <TabsContent value="results">
          <div className="glass-card p-6 rounded-lg mb-8">
            <h1 className="text-xl font-semibold mb-1">{result?.test.title}</h1>
            <p className="text-muted-foreground mb-6">{result?.test.subject}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass-card p-4 rounded-xl flex flex-col items-center">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-2 ${
                  result?.passed 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {result?.passed ? (
                    <Award className="h-8 w-8" />
                  ) : (
                    <XCircle className="h-8 w-8" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-semibold">
                  {result?.passed ? 'Passed' : 'Failed'}
                </p>
              </div>
              
              <div className="glass-card p-4 rounded-xl flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <BarChart className="h-8 w-8" />
                </div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="font-semibold">
                  {result?.attempt.score} / {result?.attempt.total_possible}
                  {result?.attempt.negative_marks > 0 && (
                    <span className="text-red-500 text-sm ml-1">
                      (-{result.attempt.negative_marks})
                    </span>
                  )}
                </p>
              </div>
              
              <div className="glass-card p-4 rounded-xl flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <BookOpen className="h-8 w-8" />
                </div>
                <p className="text-sm text-muted-foreground">Correct Answers</p>
                <p className="font-semibold">
                  {result?.correctAnswers} / {result?.totalQuestions}
                </p>
              </div>
              
              <div className="glass-card p-4 rounded-xl flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <Clock className="h-8 w-8" />
                </div>
                <p className="text-sm text-muted-foreground">Time Taken</p>
                <p className="font-semibold">{result?.timeTaken}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Your Score</p>
                  <p className="text-3xl font-bold">
                    {result?.percentageScore}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Passing Score</p>
                  <p className="text-xl font-semibold">
                    {result?.test.passing_percent}%
                  </p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${
                    result?.passed ? 'bg-green-600' : 'bg-red-500'
                  }`} 
                  style={{ width: `${result?.percentageScore}%` }}
                ></div>
              </div>
              
              <div className={`mt-4 p-3 rounded-md ${
                result?.passed 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <div className="flex items-start gap-2">
                  {result?.passed ? (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">
                      {result?.passed 
                        ? 'Congratulations! You passed the test.' 
                        : 'You did not pass the test.'}
                    </p>
                    <p className="text-sm mt-1">
                      {result?.passed 
                        ? 'You demonstrated a good understanding of the subject. Keep up the good work!' 
                        : `You need at least ${result?.test.passing_percent}% to pass. Consider reviewing the material and trying again.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-lg overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Detailed Results</h2>
              <p className="text-muted-foreground">
                See your answers and the correct solutions
              </p>
            </div>
            
            <div className="divide-y">
              {result?.answers.map((answer, index) => (
                <div key={answer.question_id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium">Question {index + 1}</h3>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                      answer.is_correct 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {answer.is_correct ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <p className="mb-4">{answer.question_text}</p>
                  
                  {answer.question_type === 'multiple_choice' && answer.options ? (
                    <div className="space-y-2">
                      {answer.options.map((option, oIndex) => (
                        <div 
                          key={oIndex}
                          className={`p-3 rounded-lg ${
                            option === answer.correct_answer && option === answer.student_answer
                              ? 'bg-green-100 border border-green-300' 
                              : option === answer.correct_answer
                              ? 'bg-green-50 border border-green-200'
                              : option === answer.student_answer
                              ? 'bg-red-100 border border-red-300'
                              : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{option}</span>
                            {option === answer.correct_answer && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                            {option === answer.student_answer && option !== answer.correct_answer && (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : answer.question_type === 'true_false' ? (
                    <div className="space-y-2">
                      <div 
                        className={`p-3 rounded-lg ${
                          'true' === answer.correct_answer && 'true' === answer.student_answer
                            ? 'bg-green-100 border border-green-300' 
                            : 'true' === answer.correct_answer
                            ? 'bg-green-50 border border-green-200'
                            : 'true' === answer.student_answer
                            ? 'bg-red-100 border border-red-300'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>True</span>
                          {'true' === answer.correct_answer && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                          {'true' === answer.student_answer && 'true' !== answer.correct_answer && (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>
                      
                      <div 
                        className={`p-3 rounded-lg ${
                          'false' === answer.correct_answer && 'false' === answer.student_answer
                            ? 'bg-green-100 border border-green-300' 
                            : 'false' === answer.correct_answer
                            ? 'bg-green-50 border border-green-200'
                            : 'false' === answer.student_answer
                            ? 'bg-red-100 border border-red-300'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>False</span>
                          {'false' === answer.correct_answer && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                          {'false' === answer.student_answer && 'false' !== answer.correct_answer && (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p>Unsupported question type</p>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-dashed">
                    <div className="flex items-start gap-2">
                      <div className="bg-amber-100 text-amber-800 p-1 rounded-full">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Explanation</p>
                        <p className="text-sm text-muted-foreground">
                          The correct answer is: <span className="font-medium">{answer.correct_answer}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rankings">
          <div className="glass-card p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">Student Rankings</h2>
                <p className="text-muted-foreground">
                  See how you compare with other students
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={loadRankings}
                disabled={rankingsLoading}
              >
                <ListFilter className="h-4 w-4 mr-2" />
                Refresh Rankings
              </Button>
            </div>

            {rankingsLoading ? (
              <div className="text-center py-8">
                <div className="spinner"></div>
                <p className="mt-4 text-muted-foreground">Loading rankings...</p>
              </div>
            ) : rankings.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">No student rankings available yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Percentage</TableHead>
                      {isFaculty && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankings.map((entry) => {
                      const isCurrentUser = entry.student_email === user?.email;
                      
                      return (
                        <TableRow key={entry.rank} className={isCurrentUser ? "bg-primary/10" : ""}>
                          <TableCell className="font-medium">#{entry.rank}</TableCell>
                          <TableCell>
                            {entry.student_name}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                You
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{entry.student_email}</TableCell>
                          <TableCell>
                            {entry.score} / {entry.total_possible}
                            {entry.negative_marks > 0 && (
                              <span className="text-red-500 text-sm ml-1">
                                (-{entry.negative_marks})
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-24">
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    entry.percentage >= 70 
                                      ? 'bg-green-600' 
                                      : entry.percentage >= 40 
                                      ? 'bg-amber-500' 
                                      : 'bg-red-500'
                                  }`} 
                                  style={{ width: `${entry.percentage}%` }}
                                ></div>
                              </div>
                              <span>{entry.percentage}%</span>
                            </div>
                          </TableCell>
                          {isFaculty && (
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => loadAttemptResults(entry.attempt_id)}
                              >
                                View Details
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestResults;
