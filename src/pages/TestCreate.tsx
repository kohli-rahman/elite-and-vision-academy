import { 
  PlusCircle, 
  MinusCircle, 
  Check, 
  Save, 
  ArrowLeft, 
  AlertCircle,
  SquareDot
} from 'lucide-react';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

// Import refactored components
import TestDetailsForm, { TestFormValues } from '@/components/test-create/TestDetailsForm';
import QuestionsForm from '@/components/test-create/QuestionsForm';
import TestCreationTips from '@/components/test-create/TestCreationTips';
import MathStyles from '@/components/test-create/MathStyles';

type QuestionType = {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false';
  options: string[];
  correct_answer: string;
  marks: number;
};

const TestCreate = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [showFormatting, setShowFormatting] = useState(false);
  
  const form = useForm<TestFormValues>({
    defaultValues: {
      title: '',
      description: '',
      subject: '',
      duration: 60,
      passing_percent: 60,
      is_published: false,
      negative_marking: false,
      negative_marks_percent: 25,
    },
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast.error('Please log in to create tests');
        navigate('/auth');
        return;
      }
      
      const currentUser = data.session.user;
      setUser(currentUser);
      
      const isAdminUser = currentUser.email === '2201cs58_rahul@iitp.ac.in';
      setIsAdmin(isAdminUser);
      
      if (!isAdminUser) {
        toast.error('You do not have permission to create tests');
        navigate('/tests');
        return;
      }
      
      setIsLoading(false);
    };
    
    checkSession();
  }, [navigate]);

  const addQuestion = () => {
    const newQuestion: QuestionType = {
      id: crypto.randomUUID(),
      question_text: '',
      question_type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      marks: 1,
    };
    
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (questionId: string, index: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[index] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, options: [...q.options, ''] };
      }
      return q;
    }));
  };

  const removeOption = (questionId: string, index: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions.splice(index, 1);
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };
  
  const insertTextFormat = (questionId: string, format: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    
    let formattedText = '';
    
    switch (format) {
      case 'superscript':
        formattedText = '<sup>2</sup>';
        break;
      case 'subscript':
        formattedText = '<sub>2</sub>';
        break;
      case 'fraction':
        formattedText = '<div class="fraction" style="display: inline-block;"><span class="numerator">a</span><span class="denominator">b</span></div>';
        break;
      case 'sqrt':
        formattedText = '<span class="math-root"><span class="math-root-symbol">√</span><span>x</span></span>';
        break;
      case 'cbrt':
        formattedText = '<span class="math-root"><span class="math-root-symbol">∛</span><span>x</span></span>';
        break;
      case 'nthroot':
        formattedText = '<span><sup>n</sup><span class="math-root"><span class="math-root-symbol">√</span><span>x</span></span></span>';
        break;
      case 'sqrtfraction':
        formattedText = '<span class="math-root"><span class="math-root-symbol">√</span><span><div class="fraction" style="display: inline-block;"><span class="numerator">a</span><span class="denominator">b</span></div></span></span>';
        break;
      case 'radical':
        formattedText = '<span class="math-root"><span class="math-root-symbol">√</span><span>a + b</span></span>';
        break;
      case 'vector':
        formattedText = '<span>→</span>';
        break;
      case 'degree':
        formattedText = '°';
        break;
      case 'pi':
        formattedText = 'π';
        break;
      case 'theta':
        formattedText = 'θ';
        break;
      case 'delta':
        formattedText = 'Δ';
        break;
      case 'infinity':
        formattedText = '∞';
        break;
    }
    
    const updatedText = question.question_text + formattedText;
    updateQuestion(questionId, 'question_text', updatedText);
    setShowFormatting(false);
  };

  const onSubmit = async (formData: TestFormValues) => {
    if (!user) {
      toast.error('You must be logged in to create a test');
      return;
    }

    if (questions.length === 0) {
      toast.error('You must add at least one question');
      return;
    }

    for (const q of questions) {
      if (!q.question_text) {
        toast.error('All questions must have text');
        return;
      }

      if (q.question_type === 'multiple_choice') {
        if (q.options.some(opt => !opt.trim())) {
          toast.error('All options must be filled');
          return;
        }

        if (!q.correct_answer) {
          toast.error('All questions must have a correct answer');
          return;
        }
      }
    }

    setIsSubmitting(true);

    try {
      const { data: test, error: testError } = await supabase
        .from('tests')
        .insert({
          title: formData.title,
          description: formData.description,
          subject: formData.subject,
          duration: formData.duration,
          passing_percent: formData.passing_percent,
          is_published: formData.is_published,
          negative_marking: formData.negative_marking,
          negative_marks_percent: formData.negative_marking ? formData.negative_marks_percent : null,
          created_by: user.id,
        })
        .select()
        .single();

      if (testError) throw testError;

      const questionsToInsert = questions.map(q => ({
        test_id: test.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.question_type === 'multiple_choice' ? q.options : null,
        correct_answer: q.correct_answer,
        marks: q.marks,
      }));

      const { error: questionsError } = await supabase
        .from('test_questions')
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;

      toast.success('Test created successfully!');
      navigate('/tests');
    } catch (error: any) {
      toast.error('Error creating test: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen section-container">
        <div className="text-center py-12">
          <div className="spinner"></div>
          <p className="mt-4 text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="pt-24 min-h-screen section-container">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
          <h2 className="mt-4 text-xl font-semibold">Access Denied</h2>
          <p className="mt-2 text-muted-foreground">
            You do not have permission to create tests.
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
      <MathStyles />
      
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/tests')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Tests
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="heading-lg">Create New Test</h1>
          <p className="text-muted-foreground">
            Set up your test details and add questions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TestDetailsForm form={form} />
            
            <QuestionsForm 
              questions={questions}
              activeQuestionId={activeQuestionId}
              showFormatting={showFormatting}
              onAddQuestion={addQuestion}
              onRemoveQuestion={removeQuestion}
              onUpdateQuestion={updateQuestion}
              onUpdateOption={updateOption}
              onAddOption={addOption}
              onRemoveOption={removeOption}
              onSetActiveQuestion={setActiveQuestionId}
              onSetShowFormatting={setShowFormatting}
              onInsertFormat={insertTextFormat}
            />
            
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/tests')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || questions.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner spinner-sm mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Test
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
        
        <div className="lg:col-span-1">
          <TestCreationTips />
        </div>
      </div>
    </div>
  );
};

export default TestCreate;
