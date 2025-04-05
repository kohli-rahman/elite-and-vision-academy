
import { useState, useCallback } from 'react';
import { Answer } from './testAttemptService';

export const useAnswerManagement = (initialAnswers: Answer[]) => {
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const updateAnswer = useCallback((questionId: string, answer: string | null) => {
    setAnswers(prev => 
      prev.map(a => 
        a.questionId === questionId ? { ...a, answer } : a
      )
    );
    setUnsavedChanges(true);
  }, []);

  const resetUnsavedChanges = useCallback(() => {
    setUnsavedChanges(false);
  }, []);

  return {
    answers,
    unsavedChanges,
    updateAnswer,
    resetUnsavedChanges
  };
};
