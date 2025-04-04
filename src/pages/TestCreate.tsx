import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { PlusCircle, MinusCircle, Check, Save, ArrowLeft, AlertCircle, Image, Superscript } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type QuestionType = {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false';
  options: string[];
  correct_answer: string;
  marks: number;
  image_url?: string;
};

const TestCreate = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  
  const form = useForm({
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
      
      // Check if user is the specific admin
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
  
  const handleImageUpload = async (questionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `question_images/${fileName}`;
    
    try {
      setUploadingImage(true);
      
      // Check if storage bucket exists, if not, we'll create it
      const { data: bucketData } = await supabase.storage.getBucket('question_images');
      
      if (!bucketData) {
        const { error: bucketError } = await supabase.storage.createBucket('question_images', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        });
        
        if (bucketError) throw bucketError;
      }
      
      const { error: uploadError } = await supabase.storage
        .from('question_images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage.from('question_images').getPublicUrl(filePath);
      
      updateQuestion(questionId, 'image_url', data.publicUrl);
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      toast.error('Error uploading image: ' + error.message);
    } finally {
      setUploadingImage(false);
      e.target.value = ''; // Clear the input
    }
  };
  
  const removeImage = (questionId: string) => {
    // Find the question
    const question = questions.find(q => q.id === questionId);
    if (!question || !question.image_url) return;
    
    // Extract the file path from the URL
    const urlParts = question.image_url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    // Remove from storage
    supabase.storage
      .from('question_images')
      .remove([`question_images/${fileName}`])
      .then(() => {
        updateQuestion(questionId, 'image_url', undefined);
        toast.success('Image removed.');
      })
      .catch((error) => {
        toast.error('Failed to remove image.');
        console.error('Error removing image:', error);
      });
  };
  
  const insertTextFormat = (questionId: string, format: 'superscript' | 'subscript') => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    
    let formattedText = '';
    
    if (format === 'superscript') {
      formattedText = '<sup>text</sup>';
    } else {
      formattedText = '<sub>text</sub>';
    }
    
    const updatedText = question.question_text + formattedText;
    updateQuestion(questionId, 'question_text', updatedText);
    setShowFormatting(false);
  };

  const onSubmit = async (formData: any) => {
    if (!user) {
      toast.error('You must be logged in to create a test');
      return;
    }

    if (questions.length === 0) {
      toast.error('You must add at least one question');
      return;
    }

    // Validate questions
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
      // First, create the test
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

      // Then, create all questions for this test
      const questionsToInsert = questions.map(q => ({
        test_id: test.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.question_type === 'multiple_choice' ? q.options : null,
        correct_answer: q.correct_answer,
        marks: q.marks,
        image_url: q.image_url || null,
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
                    name="negative_marking"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-muted/20">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Enable Negative Marking</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Check this box to deduct marks for incorrect answers
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('negative_marking') && (
                    <FormField
                      control={form.control}
                      name="negative_marks_percent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Negative Marks Percentage*</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              max="100" 
                              {...field} 
                              required 
                              placeholder="e.g., 25% of the question marks"
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground mt-1">
                            Percentage of the question marks to deduct for wrong answers (e.g., 25% means 0.25 marks deducted for a 1-mark question)
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
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
                
                {questions.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-muted-foreground">No questions added yet.</p>
                    <Button type="button" className="mt-4" onClick={addQuestion}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Your First Question
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {questions.map((question, qIndex) => (
                      <div key={question.id} className="p-4 border rounded-lg bg-card">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-medium">Question {qIndex + 1}</h3>
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
                                <label 
                                  htmlFor={`image-${question.id}`}
                                  className="flex items-center gap-1 cursor-pointer text-sm text-primary hover:text-primary/80"
                                >
                                  <Image className="h-4 w-4" />
                                  {question.image_url ? 'Change Image' : 'Add Image'}
                                </label>
                                <input
                                  type="file"
                                  id={`image-${question.id}`}
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(question.id, e)}
                                  className="hidden"
                                  disabled={uploadingImage}
                                />
                                
                                <Popover open={showFormatting && activeQuestionId === question.id} onOpenChange={(open) => {
                                  setShowFormatting(open);
                                  if (open) setActiveQuestionId(question.id);
                                }}>
                                  <PopoverTrigger asChild>
                                    <Button variant="ghost" size="sm" className="p-1 h-auto">
                                      <Superscript className="h-4 w-4" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-56">
                                    <div className="grid gap-2">
                                      <h4 className="font-medium text-sm">Text Formatting</h4>
                                      <div className="grid grid-cols-2 gap-2">
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="w-full"
                                          onClick={() => insertTextFormat(question.id, 'superscript')}
                                        >
                                          Superscript
                                          <span className="ml-1">x<sup>2</sup></span>
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="w-full"
                                          onClick={() => insertTextFormat(question.id, 'subscript')}
                                        >
                                          Subscript
                                          <span className="ml-1">H<sub>2</sub>O</span>
                                        </Button>
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Format will be applied at cursor position or end of text
                                      </p>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                            
                            {question.image_url && (
                              <div className="mb-3 relative">
                                <img 
                                  src={question.image_url} 
                                  alt="Question visual" 
                                  className="max-h-40 rounded-md border border-border"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-1 right-1"
                                  onClick={() => removeImage(question.id)}
                                >
                                  Remove
                                </Button>
                              </div>
                            )}
                            
                            <Textarea 
                              id={`q-${question.id}-text`}
                              value={question.question_text}
                              onChange={(e) => updateQuestion(question.id, 'question_text', e.target.value)}
                              placeholder="Enter your question here. Use <sup>text</sup> for superscript and <sub>text</sub> for subscript."
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
                    ))}
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
          </Form>
        </div>
        
        <div className="lg:col-span-1">
          <div className="glass-card p-6 rounded-lg sticky top-24">
            <h3 className="font-semibold text-lg mb-4">Test Creation Tips</h3>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Start with clear test details (title, duration, subject)</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Create a mix of multiple-choice and true/false questions</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Assign appropriate marks to each question based on difficulty</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Use images to illustrate complex problems</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Use superscript for exponents (x<sup>2</sup>) and subscripts for chemical formulas (H<sub>2</sub>O)</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Review all questions before publishing</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Set a reasonable passing percentage (typically 50-70%)</span>
              </li>
            </ul>
            
            <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-amber-800 text-sm">
                <strong>Note:</strong> Keep tests unpublished until they're ready for students. Once published, students will be able to see and take the tests.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCreate;
