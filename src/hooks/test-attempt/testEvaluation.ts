
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
    
    console.log("Starting test evaluation for attemptId:", attemptId);
    console.log("Total questions to evaluate:", questions.length);
    console.log("User answers:", answers);
    
    // Process question evaluations in batches
    for (const question of questions) {
      totalPossible += question.marks;
      
      const userAnswer = answers.find(a => a.questionId === question.id)?.answer;
      console.log(`Evaluating question ${question.id}:`, {
        questionText: question.question_text.substring(0, 30) + "...",
        userAnswer: userAnswer
      });
      
      if (userAnswer === null || userAnswer === undefined) {
        console.log(`No answer provided for question ${question.id}`);
        continue;
      }

      const { data: questionData, error } = await supabase
        .from('test_questions')
        .select('correct_answer')
        .eq('id', question.id)
        .single();

      if (error) {
        console.error(`Error fetching correct answer for question ${question.id}:`, error);
        continue;
      }
      
      if (!questionData) {
        console.error(`No data found for question ${question.id}`);
        continue;
      }
      
      console.log(`Question ${question.id} - User answer: "${userAnswer}", Correct answer: "${questionData.correct_answer}"`);

      // Strict string comparison to ensure exact matches
      const isCorrect = String(userAnswer).trim() === String(questionData.correct_answer).trim();
      console.log(`Question ${question.id} evaluated as: ${isCorrect ? 'Correct' : 'Incorrect'}`);
      
      if (isCorrect) {
        score += question.marks;
        console.log(`Adding ${question.marks} marks for correct answer. Current score: ${score}`);
      } else if (test.negative_marking && userAnswer) {
        const deduction = (question.marks * test.negative_marks_percent) / 100;
        negativeMarks += deduction;
        console.log(`Deducting ${deduction} marks for incorrect answer. Total negative marks: ${negativeMarks}`);
      }

      // Update the answer's correctness in the database
      const { error: updateError } = await supabase
        .from('test_answers')
        .update({ is_correct: isCorrect })
        .eq('attempt_id', attemptId)
        .eq('question_id', question.id);
        
      if (updateError) {
        console.error(`Error updating correctness for question ${question.id}:`, updateError);
      }
    }

    const finalScore = Math.max(0, score - negativeMarks);
    console.log("Final evaluation results:", {
      rawScore: score,
      negativeMarks: negativeMarks,
      finalScore: finalScore,
      totalPossible: totalPossible
    });

    // 2. Update the attempt with the final score
    const { error: attemptUpdateError } = await supabase
      .from('test_attempts')
      .update({
        end_time: new Date().toISOString(),
        status: 'completed',
        score: finalScore,
        negative_marks: negativeMarks,
        total_possible: totalPossible
      })
      .eq('id', attemptId);
      
    if (attemptUpdateError) {
      console.error("Error updating test attempt with final score:", attemptUpdateError);
      throw attemptUpdateError;
    }
    
    console.log("Test evaluation completed successfully");
    return true;
  } catch (error: any) {
    console.error('Error evaluating test:', error);
    throw error;
  }
};
