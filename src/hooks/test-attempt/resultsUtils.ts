import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Question = {
  id: string;
  question_text: string;
  question_type: string;
  options: string[] | null;
  marks: number;
  correct_answer: string;
};

export type TestAnswer = {
  id: string;
  question_id: string;
  student_answer: string | null;
  is_correct: boolean | null;
  created_at: string; // Add this field to track when the answer was saved
};

export type RankingEntry = {
  student_name: string | null;
  roll_number: string | null;
  score: number;
  total_possible: number;
  percentage: number;
  rank?: number;
  id: string; // attempt id
};

// Helper function to parse options consistently
export const parseOptions = (options: any): string[] | null => {
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
};

export const fetchTestResultsData = async (
  testId: string | undefined, 
  attemptId: string | null, 
  isAdmin: boolean
) => {
  if (!testId) {
    throw new Error('Missing test ID');
  }

  try {
    // Common structure for results
    const results = {
      test: null,
      questions: [] as Question[],
      answers: [] as TestAnswer[],
      rankings: [] as RankingEntry[],
      studentAttempts: [] as RankingEntry[],
      attempt: null,
    };

    // Optimize data fetching by only getting what we need based on view type
    if (attemptId) {
      // Fetch specific attempt data
      const { data: attemptData, error: attemptError } = await supabase
        .from('test_attempts')
        .select('*, test:tests(*)')
        .eq('id', attemptId)
        .single();
      
      if (attemptError) throw attemptError;
      results.attempt = attemptData;
      results.test = attemptData.test;
      
      // Fetch answers with created_at timestamp
      const { data: answers, error: answersError } = await supabase
        .from('test_answers')
        .select('id, question_id, student_answer, is_correct, created_at')
        .eq('attempt_id', attemptId);
      
      if (answersError) throw new Error(`Error fetching answers: ${answersError.message}`);
      
      results.answers = answers;
      
      // Only fetch questions for this test if we have an attempt
      const { data: questionsData, error: questionsError } = await supabase
        .from('test_questions')
        .select('*')
        .eq('test_id', testId)
        .order('created_at', { ascending: true });
      
      if (questionsError) throw questionsError;
      
      // Parse options once to avoid repeated parsing
      const formattedQuestions: Question[] = questionsData.map((q: any) => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: parseOptions(q.options),
        marks: q.marks,
        correct_answer: q.correct_answer
      }));
      
      results.questions = formattedQuestions;
    } else {
      // Only fetch test info if we don't have an attempt (admin view)
      const { data: testData, error: testError } = await supabase
        .from('tests')
        .select('*')
        .eq('id', testId)
        .single();
      
      if (testError) throw testError;
      results.test = testData;
      
      // If admin, fetch student rankings
      if (isAdmin) {
        const { data: rankingsData, error: rankingsError } = await supabase
          .from('test_attempts')
          .select('id, student_name, roll_number, score, total_possible')
          .eq('test_id', testId)
          .eq('status', 'completed')
          .order('score', { ascending: false });
        
        if (rankingsError) throw rankingsError;
        
        // Calculate percentage scores and assign ranks
        if (rankingsData) {
          const formattedRankings: RankingEntry[] = rankingsData.map((r: any, index: number) => ({
            id: r.id,
            student_name: r.student_name || 'Anonymous',
            roll_number: r.roll_number || 'N/A',
            score: r.score || 0,
            total_possible: r.total_possible || 0,
            percentage: r.total_possible ? Math.round((r.score / r.total_possible) * 100) : 0,
            rank: index + 1
          }));
          
          results.rankings = formattedRankings;
          results.studentAttempts = formattedRankings;
        }
      }
    }
    
    return results;
  } catch (error: any) {
    console.error('Error loading results:', error);
    throw error;
  }
};

export const getPerformanceSummary = (percentage: number, passingPercent: number) => {
  if (percentage >= 90) return "Outstanding! You have excellent understanding of the subject.";
  if (percentage >= 80) return "Great job! You have very good knowledge of the material.";
  if (percentage >= 70) return "Good work! You have a solid understanding of most concepts.";
  if (percentage >= passingPercent) return "You've passed! Continue to strengthen your knowledge in weaker areas.";
  return "You didn't pass this time. Review the material and try again.";
};

export const downloadResults = (test: any, attempt: any, questions: Question[], answers: TestAnswer[], score: any) => {
  if (!test || !questions.length) return;
  
  let content = `Test Results: ${test.title}\n`;
  content += `Subject: ${test.subject}\n`;
  content += `Student: ${attempt.student_name || 'Anonymous'}\n`;
  content += `Score: ${score.score}/${score.total} (${score.percentage}%)\n`;
  content += `Status: ${score.percentage >= (test.passing_percent || 0) ? 'PASSED' : 'FAILED'}\n\n`;
  content += `Question Details:\n\n`;
  
  questions.forEach((q, index) => {
    const answer = answers.find(a => a.question_id === q.id);
    const answered = answer?.student_answer !== null;
    const isCorrect = answer?.is_correct === true;
    
    content += `Q${index + 1}: ${q.question_text}\n`;
    content += `Your Answer: ${answered ? answer?.student_answer : 'Not answered'}\n`;
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

export const getCorrectAnswerText = (question: Question): string => {
  if (!question.correct_answer && !question.options) {
    return 'Not available';
  }
  
  // For multiple choice questions, try to get the text of the option
  if (question.question_type === 'multiple_choice' && question.options) {
    // If correct_answer is a number (index), show the text of that option
    const indexMatch = question.correct_answer.match(/^(\d+)$/);
    if (indexMatch && question.options[parseInt(indexMatch[1], 10)]) {
      const index = parseInt(indexMatch[1], 10);
      return question.options[index] || question.correct_answer;
    }
    
    // Otherwise just show the correct answer as is
    return question.correct_answer;
  }
  
  // For true/false questions, return "True" or "False"
  if (question.question_type === 'true_false') {
    return question.correct_answer === 'true' ? 'True' : 'False';
  }
  
  // For any other type, just return the correct answer
  return question.correct_answer;
};

export const getQuestionResult = (questionId: string, answers: TestAnswer[]): {
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
    timestamp: userAnswer ? userAnswer.created_at : null
  };
};
