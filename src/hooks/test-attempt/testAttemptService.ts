
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export type Attempt = {
  id: string;
  test_id: string;
  student_id: string;
  start_time: string;
  end_time: string | null;
  status: string;
};

export type Test = {
  id: string;
  title: string;
  description: string;
  subject: string;
  duration: number;
  passing_percent: number;
  negative_marking: boolean;
  negative_marks_percent: number;
};

export type Question = {
  id: string;
  question_text: string;
  question_type: string;
  options: string[] | null;
  marks: number;
};

export type Answer = {
  questionId: string;
  answer: string | null;
};

// Helper for parsing options consistently
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

export const loadTestData = async (testId: string, attemptId: string | null, userId: string) => {
  if (!testId || !attemptId || !userId) {
    throw new Error('Missing required parameters');
  }

  try {
    console.log("Starting to load test data for:", { testId, attemptId, userId });
    
    // 1. Fetch attempt data
    const { data: attemptData, error: attemptError } = await supabase
      .from('test_attempts')
      .select('*')
      .eq('id', attemptId)
      .single();

    if (attemptError) {
      console.error("Error fetching attempt data:", attemptError);
      throw attemptError;
    }
    
    if (!attemptData) {
      console.error("Test attempt not found for ID:", attemptId);
      throw new Error('Test attempt not found');
    }

    console.log("Attempt data:", attemptData);
    console.log("Current user ID:", userId);
    console.log("Attempt student ID:", attemptData.student_id);

    if (attemptData.student_id !== userId) {
      console.error("Permission mismatch. User ID:", userId, "Attempt student ID:", attemptData.student_id);
      throw new Error('You do not have permission to access this attempt');
    }

    if (attemptData.status === 'completed') {
      console.log("Attempt already completed, redirecting to results");
      return { redirectToResults: true, attemptData };
    }

    // 2. Fetch test data
    const { data: testData, error: testError } = await supabase
      .from('tests')
      .select('*')
      .eq('id', attemptData.test_id)
      .single();

    if (testError) {
      console.error("Error fetching test data:", testError);
      throw testError;
    }
    
    console.log("Test data:", testData);

    // 3. Fetch questions data
    const { data: questionsData, error: questionsError } = await supabase
      .from('test_questions')
      .select('*')
      .eq('test_id', testData.id)
      .order('created_at', { ascending: true });

    if (questionsError) {
      console.error("Error fetching questions data:", questionsError);
      throw questionsError;
    }
    
    console.log("Questions data count:", questionsData.length);
    
    const formattedQuestions: Question[] = questionsData.map((q: any) => ({
      id: q.id,
      question_text: q.question_text,
      question_type: q.question_type,
      options: parseOptions(q.options),
      marks: q.marks,
    }));

    // 4. Initialize and load existing answers
    const initialAnswers = questionsData.map((q: any) => ({
      questionId: q.id,
      answer: null,
    }));

    const { data: existingAnswers, error: answersError } = await supabase
      .from('test_answers')
      .select('question_id, student_answer')
      .eq('attempt_id', attemptId);

    if (answersError) {
      console.error("Error fetching existing answers:", answersError);
    }
    
    console.log("Existing answers:", existingAnswers);

    let finalAnswers = initialAnswers;
    if (!answersError && existingAnswers && existingAnswers.length > 0) {
      finalAnswers = initialAnswers.map(ans => {
        const existing = existingAnswers.find(
          (ea: any) => ea.question_id === ans.questionId
        );
        return existing 
          ? { ...ans, answer: existing.student_answer } 
          : ans;
      });
    }

    // 5. Calculate time left
    let timeLeft = null;
    let timeIsUp = false;
    
    if (testData && attemptData) {
      const startTime = new Date(attemptData.start_time).getTime();
      const durationMs = testData.duration * 60 * 1000;
      const endTime = startTime + durationMs;
      const now = new Date().getTime();
      const remainingMs = endTime - now;
      
      console.log("Time calculation:", { 
        startTime, 
        durationMs,
        endTime,
        now,
        remainingMs,
        timeLeftMinutes: Math.floor(remainingMs / 1000 / 60)
      });
      
      if (remainingMs <= 0) {
        timeLeft = 0;
        timeIsUp = true;
        console.log("Time is up for this test");
      } else {
        timeLeft = Math.floor(remainingMs / 1000);
      }
    }

    return {
      attemptData,
      testData,
      formattedQuestions,
      finalAnswers,
      timeLeft,
      timeIsUp,
      redirectToResults: false
    };
  } catch (error: any) {
    console.error("Error in loadTestData:", error);
    throw error;
  }
};

export const saveAnswers = async (attemptId: string, answers: Answer[]) => {
  if (!attemptId) throw new Error('Missing attempt ID');

  try {
    console.log("Saving answers for attempt:", attemptId, "Answers count:", answers.length);
    const answersToSave = answers.filter(a => a.answer !== null);
    console.log("Filtered answers to save:", answersToSave.length);
    
    // Process in batches to avoid overwhelming the server
    const batchSize = 5;
    for (let i = 0; i < answersToSave.length; i += batchSize) {
      const batch = answersToSave.slice(i, i + batchSize);
      console.log(`Processing batch ${i/batchSize + 1}, size: ${batch.length}`);
      
      const promises = batch.map(async (answer) => {
        const { data: existingAnswer, error: checkError } = await supabase
          .from('test_answers')
          .select('id')
          .eq('attempt_id', attemptId)
          .eq('question_id', answer.questionId)
          .maybeSingle();

        if (checkError) {
          console.error("Error checking existing answer:", checkError);
        }

        if (existingAnswer) {
          console.log("Updating existing answer for question:", answer.questionId);
          return supabase
            .from('test_answers')
            .update({ student_answer: answer.answer })
            .eq('id', existingAnswer.id);
        } else {
          console.log("Inserting new answer for question:", answer.questionId);
          return supabase
            .from('test_answers')
            .insert({
              attempt_id: attemptId,
              question_id: answer.questionId,
              student_answer: answer.answer
            });
        }
      });
      
      const results = await Promise.all(promises);
      console.log("Batch save results:", results);
    }
    
    console.log("All answers saved successfully");
    return true;
  } catch (error) {
    console.error('Error saving answers:', error);
    throw error;
  }
};
