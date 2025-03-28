
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const studentDetailsSchema = z.object({
  studentName: z.string().min(3, { message: "Name must be at least 3 characters" }),
  rollNumber: z.string().min(1, { message: "Roll number is required" })
});

type StudentDetailsFormProps = {
  attemptId: string | null;
  onSubmit: () => void;
};

export const StudentDetailsForm = ({ attemptId, onSubmit }: StudentDetailsFormProps) => {
  const form = useForm<z.infer<typeof studentDetailsSchema>>({
    resolver: zodResolver(studentDetailsSchema),
    defaultValues: {
      studentName: "",
      rollNumber: ""
    }
  });

  const handleSubmit = async (data: z.infer<typeof studentDetailsSchema>) => {
    if (!attemptId) return;

    try {
      await supabase
        .from('test_attempts')
        .update({
          student_name: data.studentName,
          roll_number: data.rollNumber
        })
        .eq('id', attemptId);

      onSubmit();
      toast.success('Student details saved successfully');
    } catch (error: any) {
      toast.error(`Error saving student details: ${error.message}`);
    }
  };

  return (
    <div className="pt-24 min-h-screen section-container flex items-center justify-center">
      <div className="glass-card p-8 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-6">Enter Your Details</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="studentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rollNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roll Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your roll number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Start Test
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
