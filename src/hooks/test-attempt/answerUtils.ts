import { useState, useCallback, useEffect } from 'react';
import { Answer } from './testAttemptService';

export const useAnswerManagement = (initialAnswers: Answer[] = []) => {
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    if (initialAnswers.length > 0) {
      setAnswers(prev => {
        const mergedAnswers = initialAnswers.map(newAnswer => {
          const existingAnswer = prev.find(a => a.questionId === newAnswer.questionId);
          return existingAnswer || newAnswer;
        });
        
        return mergedAnswers;
      });
    }
  }, [initialAnswers]);

  const updateAnswer = useCallback((questionId: string, answer: string | null) => {
    console.log("Updating answer:", questionId, answer);
    
    setAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(a => a.questionId === questionId);
      
      if (existingAnswerIndex >= 0) {
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = { 
          ...newAnswers[existingAnswerIndex], 
          answer 
        };
        return newAnswers;
      } else {
        return [...prev, { questionId, answer }];
      }
    });
    
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
