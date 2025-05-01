
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";
import { createNotice, updateNotice, uploadNoticeFile } from "@/services/noticeService";
import type { Notice } from "@/types/notice";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().optional(),
  published: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface NoticeFormProps {
  notice?: Notice;
  onSuccess?: (notice: Notice) => void;
}

const NoticeForm = ({ notice, onSuccess }: NoticeFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(
    notice?.file_url ? notice.file_url.split("/").pop() || null : null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: notice?.title || "",
      content: notice?.content || "",
      published: notice?.published ?? true,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      let fileUrl = notice?.file_url || null;

      // Upload file if selected
      if (file) {
        fileUrl = await uploadNoticeFile(file);
      }

      // Fixed: Ensure title is always included, not optional
      const noticeData = {
        title: data.title,
        content: data.content,
        file_url: fileUrl,
        published: data.published
      };

      let result: Notice;
      
      if (notice?.id) {
        // Update existing notice
        result = await updateNotice(notice.id, noticeData);
        toast.success("Notice updated successfully");
      } else {
        // Create new notice
        result = await createNotice(noticeData);
        toast.success("Notice created successfully");
      }

      if (onSuccess) {
        onSuccess(result);
      }

      // Reset form if creating new notice
      if (!notice?.id) {
        form.reset();
        setFile(null);
        setFileName(null);
      }
    } catch (error) {
      console.error("Error saving notice:", error);
      toast.error("Failed to save notice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter notice title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter notice content (optional)" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Attachment</FormLabel>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("file-upload")?.click()}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {fileName ? "Change file" : "Upload file"}
            </Button>
            {fileName && (
              <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                {fileName}
              </span>
            )}
          </div>
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {notice?.id ? "Update Notice" : "Create Notice"}
        </Button>
      </form>
    </Form>
  );
};

export default NoticeForm;
