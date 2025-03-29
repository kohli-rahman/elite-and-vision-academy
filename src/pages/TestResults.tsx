import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, ArrowLeft, Download, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Question = {
  id: string;
  question_text: string;
  question_type: string;
  options: string[] | null;
  marks: number;
  correct_answer: string;
};

type TestAnswer = {
  question_id: string;
  student_answer: string | null;
  is_correct: boolean | null;
};

type RankingEntry = {
  student_name: string | null;
  roll_number: string | null;
  score: number;
  total_possible: number;
  percentage: number;
  rank?: number;
  id: string; // attempt id
};

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
    const fetchResults = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        
        // Fetch test attempt if we have an attemptId
        if (attemptId) {
          const { data: attemptData, error: attemptError } = await supabase
            .from('test_attempts')
            .select('*, test:tests(*)')
            .eq('id', attemptId)
            .single();
          
          if (attemptError) throw attemptError;
          setAttempt(attemptData);
          setTest(attemptData.test);
          
          // Fetch answers for this attempt
          const { data: answersData, error: answersError } = await supabase
            .from('test_answers')
            .select('*')
            .eq('attempt_id', attemptId);
          
          if (answersError) throw answersError;
          setAnswers(answersData);
        } else {
          // If no attempt ID is provided, just fetch the test
          const { data: testData, error: testError } = await supabase
            .from('tests')
            .select('*')
            .eq('id', id)
            .single();
          
          if (testError) throw testError;
          setTest(testData);
        }
        
        // Fetch test questions
        const { data: questionsData, error: questionsError } = await supabase
          .from('test_questions')
          .select('*')
          .eq('test_id', id)
          .order('created_at', { ascending: true });
        
        if (questionsError) throw questionsError;
        
        // Fix the type incompatibility by properly parsing the options
        const formattedQuestions: Question[] = questionsData.map((q: any) => ({
          id: q.id,
          question_text: q.question_text,
          question_type: q.question_type,
          options: q.options ? 
            (Array.isArray(q.options) ? q.options : 
              typeof q.options === 'string' ? JSON.parse(q.options) : 
              Array.isArray(JSON.parse(JSON.stringify(q.options))) ? 
                JSON.parse(JSON.stringify(q.options)) : null) : 
            null,
          marks: q.marks,
          correct_answer: q.correct_answer
        }));
        
        setQuestions(formattedQuestions);
        
        // If admin, fetch all student attempts for this test
        if (isAdmin) {
          const { data: rankingsData, error: rankingsError } = await supabase
            .from('test_attempts')
            .select('id, student_name, roll_number, score, total_possible')
            .eq('test_id', id)
            .eq('status', 'completed')
            .order('score', { ascending: false });
          
          if (rankingsError) throw rankingsError;
          
          // Calculate percentage scores and assign ranks for rankings
          const formattedRankings: RankingEntry[] = rankingsData.map((r: any, index: number) => ({
            id: r.id,
            student_name: r.student_name || 'Anonymous',
            roll_number: r.roll_number || 'N/A',
            score: r.score || 0,
            total_possible: r.total_possible || 0,
            percentage: r.total_possible ? Math.round((r.score / r.total_possible) * 100) : 0,
            rank: index + 1
          }));
          
          setRankings(formattedRankings);
          setStudentAttempts(formattedRankings);
        }
        
        setIsLoading(false);
      } catch (error: any) {
        toast.error(`Error loading results: ${error.message}`);
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, [id, attemptId, isAdmin]);

  const getScore = () => {
    if (!attempt) return { score: 0, total: 0, percentage: 0, negativeMark: 0 };
    
    const score = attempt.score || 0;
    const total = attempt.total_possible || 0;
    const negativeMark = attempt.negative_marks || 0;
    const percentage = total ? Math.round((score / total) * 100) : 0;
    
    return { score, total, percentage, negativeMark };
  };
  
  const isPassed = () => {
    const { percentage } = getScore();
    return test ? percentage >= (test.passing_percent || 0) : false;
  };
  
  const getPerformanceSummary = () => {
    const { percentage } = getScore();
    
    if (percentage >= 90) return "Outstanding! You have excellent understanding of the subject.";
    if (percentage >= 80) return "Great job! You have very good knowledge of the material.";
    if (percentage >= 70) return "Good work! You have a solid understanding of most concepts.";
    if (percentage >= test?.passing_percent) return "You've passed! Continue to strengthen your knowledge in weaker areas.";
    return "You didn't pass this time. Review the material and try again.";
  };

  const getQuestionResult = (questionId: string) => {
    const answer = answers.find(a => a.question_id === questionId);
    if (!answer) return { answered: false, isCorrect: false, answer: null };
    
    return {
      answered: answer.student_answer !== null,
      isCorrect: answer.is_correct === true,
      answer: answer.student_answer
    };
  };
  
  const getCorrectAnswerText = (question: Question) => {
    if (question.question_type === 'multiple_choice' && question.options) {
      const options = Array.isArray(question.options) ? 
        question.options : 
        JSON.parse(typeof question.options === 'string' ? question.options : JSON.stringify(question.options));
      
      const correctOption = options[parseInt(question.correct_answer)];
      return correctOption || question.correct_answer;
    }
    
    return question.correct_answer;
  };
  
  const downloadResults = () => {
    if (!test || !questions.length) return;
    
    let content = `Test Results: ${test.title}\n`;
    content += `Subject: ${test.subject}\n`;
    content += `Student: ${attempt.student_name || 'Anonymous'}\n`;
    content += `Score: ${getScore().score}/${getScore().total} (${getScore().percentage}%)\n`;
    content += `Status: ${isPassed() ? 'PASSED' : 'FAILED'}\n\n`;
    content += `Question Details:\n\n`;
    
    questions.forEach((q, index) => {
      const { answered, isCorrect, answer } = getQuestionResult(q.id);
      
      content += `Q${index + 1}: ${q.question_text}\n`;
      content += `Your Answer: ${answered ? answer : 'Not answered'}\n`;
      content += `Correct Answer: ${getCorrectAnswerText(q)}\n`;
      content += `Result: ${answered ? (isCorrect ? 'Correct' : 'Incorrect') : 'Not answered'}\n\n`;
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test_results_${test.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getUserRank = () => {
    if (!rankings.length || !attempt) return null;
    
    const userRank = rankings.find(r => 
      r.student_name === attempt.student_name && 
      r.roll_number === attempt.roll_number
    )?.rank;
    
    return userRank || null;
  };
  
  const viewStudentAttempt = (attemptId: string) => {
    // Navigate to the specific student's attempt results
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
  
  // If admin and no specific attempt is being viewed, show the student attempts table
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
          
          {/* Score Distribution Chart */}
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
  
  // Display individual attempt details (for both admin viewing a specific attempt and students viewing their own)
  const { score, total, percentage, negativeMark } = attempt?.score !== undefined ? 
    { 
      score: attempt.score || 0, 
      total: attempt.total_possible || 0, 
      percentage: attempt.total_possible ? Math.round((attempt.score / attempt.total_possible) * 100) : 0,
      negativeMark: attempt.negative_marks || 0
    } : 
    { score: 0, total: 0, percentage: 0, negativeMark: 0 };

  const userRank = getUserRank();

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
                {score}/{total}
              </div>
              <div className="text-lg text-muted-foreground">
                {percentage}% {percentage >= (test.passing_percent || 0) ? 'Passed' : 'Failed'}
              </div>
              {userRank && (
                <div className="text-md font-semibold text-primary">
                  Rank: #{userRank}
                </div>
              )}
              {negativeMark > 0 && (
                <div className="text-sm text-destructive">
                  Negative marks: {negativeMark}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <span>Your score</span>
            <span>{percentage}%</span>
          </div>
          <Progress 
            value={percentage} 
            className={`h-2 ${percentage >= (test.passing_percent || 0) ? 'bg-green-200' : 'bg-red-200'}`}
          />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>0%</span>
            <span className={`${percentage >= (test.passing_percent || 0) ? 'text-green-600' : 'text-red-600'} font-medium`}>
              Passing: {test.passing_percent}%
            </span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="p-4 rounded-md bg-primary/5 border border-primary/10">
          <p className="text-md">
            {getPerformanceSummary()}
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={downloadResults}>
            <Download className="h-4 w-4 mr-2" />
            Download Results
          </Button>
        </div>
      </div>
      
      {/* Detailed Question Analysis */}
      <div className="glass-card p-8 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-6">Question Analysis</h2>
        
        <div className="space-y-8">
          {questions.map((question, index) => {
            const { answered, isCorrect, answer } = getQuestionResult(question.id);
            
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
                
                <p className="mb-4">{question.question_text}</p>
                
                <div className="grid gap-3">
                  {question.options && (
                    <div className="space-y-2">
                      {(Array.isArray(question.options) 
                        ? question.options 
                        : JSON.parse(typeof question.options === 'string' 
                            ? question.options 
                            : JSON.stringify(question.options)
                          )
                      ).map((option: string, optionIndex: number) => (
                        <div 
                          key={optionIndex}
                          className={`p-3 rounded ${
                            optionIndex.toString() === question.correct_answer
                              ? 'bg-green-100 border-green-200'
                              : answer === optionIndex.toString() && !isCorrect
                                ? 'bg-red-100 border-red-200'
                                : 'bg-gray-50 border-gray-200'
                          } border`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4 grid gap-2">
                    <div>
                      <span className="font-medium">Your answer:</span> 
                      <span className="ml-2">
                        {answered ? answer : 'Not answered'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Correct answer:</span> 
                      <span className="ml-2">{getCorrectAnswerText(question)}</span>
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
