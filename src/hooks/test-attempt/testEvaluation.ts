
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Question, Test, Answer } from './testAttemptService';

export const evaluateAndSubmitTest = async (
  attemptId: string,
  test: Test,
  questions: Question[],
  answers: Answer[]
): Promise<boolean> => {
  try {
    // 1. Calculate the score
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

      // Update the answer's correctness
      await supabase
        .from('test_answers')
        .update({ is_correct: isCorrect })
        .eq('attempt_id', attemptId)
        .eq('question_id', question.id);
    }

    // 2. Update the attempt with the final score
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

    return true;
  } catch (error: any) {
    console.error('Error evaluating test:', error);
    throw error;
  }
};
