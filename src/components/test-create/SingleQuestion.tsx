
import { useState } from 'react';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import FormattingTools from './FormattingTools';
import QuestionOption from './QuestionOption';

type QuestionType = {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false';
  options: string[];
  correct_answer: string;
  marks: number;
};

type SingleQuestionProps = {
  question: QuestionType;
  index: number;
  showFormatting: boolean;
  activeQuestionId: string | null;
  onRemoveQuestion: (id: string) => void;
  onUpdateQuestion: (id: string, field: string, value: any) => void;
  onUpdateOption: (questionId: string, index: number, value: string) => void;
  onAddOption: (questionId: string) => void;
  onRemoveOption: (questionId: string, index: number) => void;
  onSetActiveQuestion: (id: string | null) => void;
  onSetShowFormatting: (show: boolean) => void;
  onInsertFormat: (questionId: string, format: string) => void;
};

const SingleQuestion = ({
  question,
  index,
  showFormatting,
  activeQuestionId,
  onRemoveQuestion,
  onUpdateQuestion,
  onUpdateOption,
  onAddOption,
  onRemoveOption,
  onSetActiveQuestion,
  onSetShowFormatting,
  onInsertFormat
}: SingleQuestionProps) => {
  const handleFormattingOpenChange = (open: boolean) => {
    onSetShowFormatting(open);
    if (open) {
      onSetActiveQuestion(question.id);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium">Question {index + 1}</h3>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => onRemoveQuestion(question.id)}
          className="text-destructive hover:text-destructive/80"
        >
          <MinusCircle className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor={`q-${question.id}-text`}>Question Text*</Label>
            <div className="flex items-center gap-2">
              <FormattingTools 
                questionId={question.id}
                showFormatting={showFormatting}
                isActiveQuestion={activeQuestionId === question.id}
                onOpenChange={handleFormattingOpenChange}
                onInsertFormat={onInsertFormat}
              />
            </div>
          </div>
          
          <Textarea 
            id={`q-${question.id}-text`}
            value={question.question_text}
            onChange={(e) => onUpdateQuestion(question.id, 'question_text', e.target.value)}
            placeholder="Enter your question here. Use text formatting options for mathematical expressions."
            className="mt-1"
            required
          />
          <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
            <div className="flex items-center">
              <span>Example: Energy = mc<sup>2</sup> is written as "Energy = mc<strong>&lt;sup&gt;</strong>2<strong>&lt;/sup&gt;</strong>"</span>
            </div>
          </div>
        </div>
        
        <div>
          <Label>Question Type*</Label>
          <div className="flex gap-4 mt-1">
            <div className="flex items-center">
              <input 
                type="radio" 
                id={`q-${question.id}-mc`}
                name={`q-${question.id}-type`}
                checked={question.question_type === 'multiple_choice'}
                onChange={() => onUpdateQuestion(question.id, 'question_type', 'multiple_choice')}
                className="mr-2"
              />
              <Label htmlFor={`q-${question.id}-mc`}>Multiple Choice</Label>
            </div>
            <div className="flex items-center">
              <input 
                type="radio" 
                id={`q-${question.id}-tf`}
                name={`q-${question.id}-type`}
                checked={question.question_type === 'true_false'}
                onChange={() => onUpdateQuestion(question.id, 'question_type', 'true_false')}
                className="mr-2"
              />
              <Label htmlFor={`q-${question.id}-tf`}>True/False</Label>
            </div>
          </div>
        </div>
        
        {question.question_type === 'multiple_choice' ? (
          <div>
            <div className="flex justify-between items-center">
              <Label>Options*</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => onAddOption(question.id)}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Option
              </Button>
            </div>
            
            {question.options.map((option, optIndex) => (
              <QuestionOption
                key={optIndex}
                index={optIndex}
                option={option}
                correct={question.correct_answer === option}
                questionId={question.id}
                canRemove={question.options.length > 2}
                onOptionChange={onUpdateOption}
                onCorrectAnswerChange={(qId, answer) => onUpdateQuestion(qId, 'correct_answer', answer)}
                onRemoveOption={onRemoveOption}
              />
            ))}
          </div>
        ) : (
          <div>
            <Label>Correct Answer*</Label>
            <div className="flex gap-4 mt-1">
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id={`q-${question.id}-true`}
                  name={`q-${question.id}-tf-correct`}
                  checked={question.correct_answer === 'true'}
                  onChange={() => onUpdateQuestion(question.id, 'correct_answer', 'true')}
                  className="mr-2"
                />
                <Label htmlFor={`q-${question.id}-true`}>True</Label>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id={`q-${question.id}-false`}
                  name={`q-${question.id}-tf-correct`}
                  checked={question.correct_answer === 'false'}
                  onChange={() => onUpdateQuestion(question.id, 'correct_answer', 'false')}
                  className="mr-2"
                />
                <Label htmlFor={`q-${question.id}-false`}>False</Label>
              </div>
            </div>
          </div>
        )}
        
        <div>
          <Label htmlFor={`q-${question.id}-marks`}>Marks*</Label>
          <Input 
            id={`q-${question.id}-marks`}
            type="number"
            min="1"
            value={question.marks}
            onChange={(e) => onUpdateQuestion(question.id, 'marks', parseInt(e.target.value))}
            className="mt-1 w-24"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default SingleQuestion;
