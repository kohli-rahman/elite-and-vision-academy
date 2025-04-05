
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Define the form values type to match the type in TestCreate.tsx
export type TestFormValues = {
  title: string;
  description: string;
  subject: string;
  duration: number;
  passing_percent: number;
  is_published: boolean;
  negative_marking: boolean;
  negative_marks_percent: number;
};

type TestDetailsFormProps = {
  form: ReturnType<typeof useForm<TestFormValues>>;
};

const TestDetailsForm = ({ form }: TestDetailsFormProps) => {
  return (
    <div className="glass-card p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Test Details</h2>
      
      {/* Wrap the form fields in the Form component */}
      <Form {...form}>
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
      </Form>
    </div>
  );
};

export default TestDetailsForm;
