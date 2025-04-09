import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { PlusCircle, MinusCircle, Check, Save, ArrowLeft, AlertTriangle, SquareDot } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import MathStyles from '@/components/test-create/MathStyles';
import FormattingTools from '@/components/test-create/FormattingTools';

type QuestionType = {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false';
  options: string[];
  correct_answer: string;
  marks: number;
  isNew?: boolean;
  isDeleted?: boolean;
};

const TestEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAttempts, setHasAttempts] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [showFormatting, setShowFormatting] = useState(false);
  
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      subject: '',
      duration: 60,
      passing_percent: 60,
      is_published: false,
    },
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast.error('Please log in to edit tests');
        navigate('/auth');
        return;
      }
      setUser(data.session.user);
    };
    
    checkSession();
  }, [navigate]);

  useEffect(() => {
    const loadTest = async () => {
      if (!id || !user) return;

      try {
        setIsLoading(true);
        
        const { data: test, error: testError } = await supabase
          .from('tests')
          .select('*')
          .eq('id', id)
          .single();
        
        if (testError) throw testError;
        
        form.reset({
          title: test.title,
          description: test.description || '',
          subject: test.subject,
          duration: test.duration,
          passing_percent: test.passing_percent,
          is_published: test.is_published,
        });
        
        const { data: attempts, error: attemptsError } = await supabase
          .from('test_attempts')
          .select('id')
          .eq('test_id', id)
          .limit(1);
        
        if (!attemptsError && attempts && attempts.length > 0) {
          setHasAttempts(true);
        }
        
        const { data: questionsData, error: questionsError } = await supabase
          .from('test_questions')
          .select('*')
          .eq('test_id', id)
          .order('created_at', { ascending: true });
        
        if (questionsError) throw questionsError;
        
        const formattedQuestions = questionsData.map((q: any) => ({
          id: q.id,
          question_text: q.question_text,
          question_type: q.question_type,
          options: q.options || ['', '', '', ''],
          correct_answer: q.correct_answer,
          marks: q.marks,
        }));
        
        setQuestions(formattedQuestions);
        setIsLoading(false);
      } catch (error: any) {
        toast.error(`Error loading test: ${error.message}`);
        navigate('/tests');
      }
    };
    
    loadTest();
  }, [id, user, navigate, form]);

  const addQuestion = () => {
    const newQuestion: QuestionType = {
      id: crypto.randomUUID(),
      question_text: '',
      question_type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      marks: 1,
      isNew: true,
    };
    
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    if (questions.find(q => q.id === id)?.isNew) {
      setQuestions(questions.filter(q => q.id !== id));
      return;
    }
    
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, isDeleted: true } : q
    ));
  };

  const restoreQuestion = (id: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, isDeleted: false } : q
    ));
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

  const onSubmit = async (formData: any) => {
    if (!id || !user) {
      toast.error('You must be logged in to update a test');
      return;
    }

    const activeQuestions = questions.filter(q => !q.isDeleted);
    if (activeQuestions.length === 0) {
      toast.error('You must have at least one question');
      return;
    }

    for (const q of activeQuestions) {
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
      const { error: testError } = await supabase
        .from('tests')
        .update({
          title: formData.title,
          description: formData.description,
          subject: formData.subject,
          duration: formData.duration,
          passing_percent: formData.passing_percent,
          is_published: formData.is_published,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (testError) throw testError;

      const newQuestions = questions.filter(q => q.isNew && !q.isDeleted);
      const deletedQuestions = questions.filter(q => q.isDeleted && !q.isNew);
      const updatedQuestions = questions.filter(q => !q.isNew && !q.isDeleted);
      
      if (newQuestions.length > 0) {
        const questionsToInsert = newQuestions.map(q => ({
          test_id: id,
          question_text: q.question_text,
          question_type: q.question_type,
          options: q.question_type === 'multiple_choice' ? q.options : null,
          correct_answer: q.correct_answer,
          marks: q.marks,
        }));

        const { error: newQuestionsError } = await supabase
          .from('test_questions')
          .insert(questionsToInsert);

        if (newQuestionsError) throw newQuestionsError;
      }
      
      if (deletedQuestions.length > 0) {
        const { error: deleteError } = await supabase
          .from('test_questions')
          .delete()
          .in('id', deletedQuestions.map(q => q.id));

        if (deleteError) throw deleteError;
      }
      
      for (const q of updatedQuestions) {
        const { error: updateError } = await supabase
          .from('test_questions')
          .update({
            question_text: q.question_text,
            question_type: q.question_type,
            options: q.question_type === 'multiple_choice' ? q.options : null,
            correct_answer: q.correct_answer,
            marks: q.marks,
          })
          .eq('id', q.id);

        if (updateError) throw updateError;
      }

      toast.success('Test updated successfully!');
      navigate('/tests');
    } catch (error: any) {
      toast.error('Error updating test: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen section-container">
        <div className="text-center py-12">
          <div className="spinner"></div>
          <p className="mt-4 text-muted-foreground">Loading test...</p>
        </div>
      </div>
    );
  }

  const activeQuestions = questions.filter(q => !q.isDeleted);

  const renderHTML = (htmlContent: string) => {
    return { __html: htmlContent };
  };

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
          <h1 className="heading-lg">Edit Test</h1>
          <p className="text-muted-foreground">
            Update test details and questions
          </p>
        </div>
      </div>

      {hasAttempts && (
        <div className="glass-card p-4 rounded-lg mb-6 bg-amber-50 border border-amber-200">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">
                Warning: This test has already been attempted by students
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Editing the test content may affect the validity of existing results. Consider creating a new test instead.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="glass-card p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Test Details</h2>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Test Title*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Midterm Physics Test" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide details about this test" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject*</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Physics, Math" {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (minutes)*</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              max="180" 
                              {...field} 
                              required 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="passing_percent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passing Percentage*</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="100" 
                            {...field} 
                            required 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="is_published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-muted/20">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Publish Test</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Check this box to make the test available to students
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Test Questions</h2>
                  <Button type="button" variant="outline" onClick={addQuestion}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
                
                {activeQuestions.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-muted-foreground">No questions available.</p>
                    <Button type="button" className="mt-4" onClick={addQuestion}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {questions.map((question, qIndex) => {
                      if (question.isDeleted) {
                        return (
                          <div key={question.id} className="p-4 border border-dashed rounded-lg bg-gray-50">
                            <div className="flex justify-between items-center">
                              <div className="text-muted-foreground">
                                <span className="line-through">Question {qIndex + 1} (Removed)</span>
                              </div>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => restoreQuestion(question.id)}
                              >
                                Restore
                              </Button>
                            </div>
                          </div>
                        );
                      }
                      
                      return (
                        <div key={question.id} className="p-4 border rounded-lg bg-card">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-medium">Question {activeQuestions.indexOf(question) + 1}</h3>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeQuestion(question.id)}
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
                                    onOpenChange={(open) => {
                                      setShowFormatting(open);
                                      if (open) {
                                        setActiveQuestionId(question.id);
                                      }
                                    }}
                                    onInsertFormat={insertTextFormat}
                                  />
                                </div>
                              </div>
                              <Textarea 
                                id={`q-${question.id}-text`}
                                value={question.question_text}
                                onChange={(e) => updateQuestion(question.id, 'question_text', e.target.value)}
                                placeholder="Enter your question here. Use text formatting options for mathematical expressions."
                                className="mt-1"
                                required
                              />
                              
                              {question.question_text && (
                                <div className="mt-2 p-2 border rounded bg-muted/20">
                                  <p className="text-sm font-medium mb-1">Preview:</p>
                                  <div 
                                    className="text-sm" 
                                    dangerouslySetInnerHTML={renderHTML(question.question_text)}
                                  ></div>
                                </div>
                              )}
                              
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
                                    onChange={() => updateQuestion(question.id, 'question_type', 'multiple_choice')}
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
                                    onChange={() => updateQuestion(question.id, 'question_type', 'true_false')}
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
                                    onClick={() => addOption(question.id)}
                                  >
                                    <PlusCircle className="h-4 w-4 mr-1" />
                                    Add Option
                                  </Button>
                                </div>
                                
                                {question.options.map((option, index) => (
                                  <div key={index} className="flex items-center gap-2 mt-2">
                                    <input 
                                      type="radio" 
                                      name={`q-${question.id}-correct`}
                                      checked={question.correct_answer === option}
                                      onChange={() => updateQuestion(question.id, 'correct_answer', option)}
                                      className="mr-1"
                                    />
                                    <Input 
                                      value={option}
                                      onChange={(e) => updateOption(question.id, index, e.target.value)}
                                      placeholder={`Option ${index + 1}`}
                                      required
                                    />
                                    {question.options.length > 2 && (
                                      <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => removeOption(question.id, index)}
                                        className="text-destructive hover:text-destructive/80"
                                      >
                                        <MinusCircle className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
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
                                      onChange={() => updateQuestion(question.id, 'correct_answer', 'true')}
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
                                      onChange={() => updateQuestion(question.id, 'correct_answer', 'false')}
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
                                onChange={(e) => updateQuestion(question.id, 'marks', parseInt(e.target.value))}
                                className="mt-1 w-24"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
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
                  disabled={isSubmitting || activeQuestions.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner spinner-sm mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Test
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
        
        <div className="lg:col-span-1">
          <div className="glass-card p-6 rounded-lg sticky top-24">
            <h3 className="font-semibold text-lg mb-4">Test Editing Tips</h3>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Use clear, concise language in your questions</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Make sure each question has a correct answer marked</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Double-check for typos and errors before publishing</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Assign appropriate marks to each question based on difficulty</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Review your test from a student's perspective</span>
              </li>
            </ul>
            
            <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-amber-800 text-sm">
                <strong>Note:</strong> Keep tests unpublished until they're ready for students. When published, students will be able to see and take the tests.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestEdit;
