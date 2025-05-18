import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, ArrowLeft, Download, Trophy, Clock } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  fetchTestResultsData, 
  getPerformanceSummary, 
  downloadResults, 
  getCorrectAnswerText,
  getQuestionResult,
  Question,
  TestAnswer,
  RankingEntry
} from '@/hooks/test-attempt/resultsUtils';
import { format } from 'date-fns';

const TestResults = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const attemptId = searchParams.get('attemptId');
  
  const [test, setTest] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [studentAttempts, setStudentAttempts] = useState<RankingEntry[]>([]);
  const [attempt, setAttempt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user || null;
      
      setIsAdmin(currentUser?.email === '2201cs58_rahul@iitp.ac.in');
    };
    
    checkUser();
  }, []);

  useEffect(() => {
    const loadResults = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        
        const results = await fetchTestResultsData(id, attemptId, isAdmin);
        
        setTest(results.test);
        setQuestions(results.questions);
        setAnswers(results.answers);
        setRankings(results.rankings);
        setStudentAttempts(results.studentAttempts);
        setAttempt(results.attempt);
        
        setIsLoading(false);
      } catch (error: any) {
        toast.error(`Error loading results: ${error.message}`);
        setIsLoading(false);
      }
    };
    
    loadResults();
  }, [id, attemptId, isAdmin]);

  // Format the timestamp for display
  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return 'Not recorded';
    
    try {
      return format(new Date(timestamp), 'MMM d, yyyy h:mm:ss a');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getQuestionResult = (questionId: string, answers: TestAnswer[]): {
    answered: boolean;
    isCorrect: boolean;
    answer: string | null;
    timestamp: string | null;
  } => {
    const userAnswer = answers.find(a => a.question_id === questionId);
    
    return {
      answered: !!userAnswer && userAnswer.student_answer !== null,
      isCorrect: !!userAnswer && userAnswer.is_correct === true,
      answer: userAnswer ? userAnswer.student_answer : null,
      timestamp: userAnswer ? userAnswer.timestamp : null
    };
  };

  const getAnswerText = (question: Question, answerValue: string | null): string => {
    if (answerValue === null) return 'Not answered';
    
    if (question.question_type === 'multiple_choice' && question.options && /^\d+$/.test(answerValue)) {
      const index = parseInt(answerValue, 10);
      if (question.options[index]) {
        return question.options[index];
      }
    }
    
    if (question.question_type === 'true_false') {
      return answerValue === 'true' ? 'True' : 'False';
    }
    
    return answerValue;
  };

  const score = useMemo(() => {
    if (!attempt) return { score: 0, total: 0, percentage: 0, negativeMark: 0 };
    
    const scoreValue = attempt.score || 0;
    const total = attempt.total_possible || 0;
    const negativeMark = attempt.negative_marks || 0;
    const percentage = total ? Math.round((scoreValue / total) * 100) : 0;
    
    return { score: scoreValue, total, percentage, negativeMark };
  }, [attempt]);
  
  const isPassed = useMemo(() => {
    return test ? score.percentage >= (test.passing_percent || 0) : false;
  }, [test, score.percentage]);
  
  const userRank = useMemo(() => {
    if (!rankings.length || !attempt) return null;
    
    const foundRank = rankings.find(r => 
      r.student_name === attempt.student_name && 
      r.roll_number === attempt.roll_number
    )?.rank;
    
    return foundRank || null;
  }, [rankings, attempt]);

  const handleDownloadResults = () => {
    downloadResults(test, attempt, questions, answers, score);
  };
  
  const viewStudentAttempt = (attemptId: string) => {
    window.location.href = `/tests/${id}/results?attemptId=${attemptId}`;
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

  if (!test) {
    return (
      <div className="pt-24 min-h-screen section-container">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
          <h2 className="mt-4 text-xl font-semibold">Results Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            The test results you're looking for don't exist or you don't have permission to access them.
          </p>
          <Button asChild className="mt-4">
            <Link to="/tests">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tests
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  if (isAdmin && !attemptId) {
    return (
      <div className="pt-24 min-h-screen pb-12 section-container">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/tests">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tests
            </Link>
          </Button>
        </div>
        
        <div className="glass-card p-8 rounded-lg mb-8">
          <h1 className="text-2xl font-bold mb-4">{test.title} - Student Results</h1>
          <p className="text-muted-foreground mb-6">Subject: {test.subject}</p>
          
          {studentAttempts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentAttempts.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>#{student.rank}</TableCell>
                      <TableCell>{student.student_name}</TableCell>
                      <TableCell>{student.roll_number}</TableCell>
                      <TableCell>{student.score}/{student.total_possible}</TableCell>
                      <TableCell>{student.percentage}%</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.percentage >= (test.passing_percent || 0) 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.percentage >= (test.passing_percent || 0) ? 'Passed' : 'Failed'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => viewStudentAttempt(student.id)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p>No student attempts for this test yet.</p>
            </div>
          )}
          
          {studentAttempts.length > 0 && (
            <div className="mt-8">
              <h3 className="font-medium mb-4">Score Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={studentAttempts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="student_name" 
                    label={{ value: 'Students', position: 'insideBottom', offset: -5 }}
                    tick={false}
                  />
                  <YAxis 
                    label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value, name, props) => [`${value}%`, 'Score']}
                    labelFormatter={(label) => {
                      const entry = studentAttempts.find(r => r.student_name === label);
                      return entry?.student_name || 'Anonymous';
                    }}
                  />
                  <Bar dataKey="percentage" fill="#8884d8" name="Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-24 min-h-screen pb-12 section-container">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link to={isAdmin ? `/tests/${id}/results` : "/tests"}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isAdmin ? 'Back to All Results' : 'Back to Tests'}
          </Link>
        </Button>
      </div>
      
      <div className="glass-card p-8 rounded-lg mb-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{test.title}</h1>
            <p className="text-muted-foreground">{test.subject}</p>
            {attempt.student_name && (
              <p className="mt-2">
                <span className="font-medium">Student:</span> {attempt.student_name}
                {attempt.roll_number && ` (${attempt.roll_number})`}
              </p>
            )}
          </div>
          
          <div className="flex flex-col items-end justify-center">
            <div className="text-right">
              <div className="text-3xl font-bold">
                {score.score}/{score.total}
              </div>
              <div className="text-lg text-muted-foreground">
                {score.percentage}% {score.percentage >= (test.passing_percent || 0) ? 'Passed' : 'Failed'}
              </div>
              {userRank && (
                <div className="text-md font-semibold text-primary">
                  Rank: #{userRank}
                </div>
              )}
              {score.negativeMark > 0 && (
                <div className="text-sm text-destructive">
                  Negative marks: {score.negativeMark}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <span>Your score</span>
            <span>{score.percentage}%</span>
          </div>
          <Progress 
            value={score.percentage} 
            className={`h-2 ${score.percentage >= (test.passing_percent || 0) ? 'bg-green-200' : 'bg-red-200'}`}
          />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>0%</span>
            <span className={`${score.percentage >= (test.passing_percent || 0) ? 'text-green-600' : 'text-red-600'} font-medium`}>
              Passing: {test.passing_percent}%
            </span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="p-4 rounded-md bg-primary/5 border border-primary/10">
          <p className="text-md">
            {getPerformanceSummary(score.percentage, test.passing_percent || 0)}
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleDownloadResults}>
            <Download className="h-4 w-4 mr-2" />
            Download Results
          </Button>
        </div>
      </div>
      
      <div className="glass-card p-8 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-6">Question Analysis</h2>
        
        <div className="space-y-8">
          {questions.map((question, index) => {
            const { answered, isCorrect, answer, timestamp } = getQuestionResult(question.id, answers);
            
            return (
              <div 
                key={question.id} 
                className={`p-6 rounded-lg border ${
                  answered 
                    ? (isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50') 
                    : 'border-amber-200 bg-amber-50'
                }`}
              >
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Question {index + 1}</h3>
                  <span className={`text-sm font-medium ${
                    answered 
                      ? (isCorrect ? 'text-green-600' : 'text-red-600') 
                      : 'text-amber-600'
                  }`}>
                    {answered 
                      ? (isCorrect ? 'Correct' : 'Incorrect') 
                      : 'Not Answered'}
                  </span>
                </div>
                
                <p className="mb-4" dangerouslySetInnerHTML={{ __html: question.question_text }}></p>
                
                <div className="grid gap-3">
                  {question.options && (
                    <div className="space-y-2">
                      {question.options.map((option: string, optionIndex: number) => (
                        <div 
                          key={optionIndex}
                          className={`p-3 rounded ${
                            optionIndex.toString() === question.correct_answer
                              ? 'bg-green-100 border-green-200'
                              : answer === optionIndex.toString() && !isCorrect
                                ? 'bg-red-100 border-red-200'
                                : 'bg-gray-50 border-gray-200'
                          } border`}
                          dangerouslySetInnerHTML={{ __html: option }}
                        >
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4 grid gap-2">
                    <div>
                      <span className="font-medium">Your answer:</span> 
                      <span className="ml-2">
                        {answered ? getAnswerText(question, answer) : 'Not answered'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Correct answer:</span> 
                      <span className="ml-2" dangerouslySetInnerHTML={{ __html: getCorrectAnswerText(question) }}></span>
                    </div>
                    
                    {/* Add timestamp information */}
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Answered at: {formatTimestamp(timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TestResults;
