
import { formatDistanceToNow } from "date-fns";
import { FileText, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Notice } from "@/types/notice";

interface NoticeCardProps {
  notice: Notice;
  className?: string;
}

const NoticeCard = ({ notice, className = "" }: NoticeCardProps) => {
  const formattedDate = notice.created_at 
    ? formatDistanceToNow(new Date(notice.created_at), { addSuffix: true })
    : "";

  return (
    <Card className={`w-full animate-fade-in ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{notice.title}</CardTitle>
        <CardDescription>Posted {formattedDate}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        {notice.content && (
          <p className="text-muted-foreground">{notice.content}</p>
        )}
      </CardContent>
      {notice.file_url && (
        <CardFooter>
          <a 
            href={notice.file_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button variant="outline" className="w-full gap-2" size="sm">
              {notice.file_url.split('/').pop()?.length > 20 
                ? notice.file_url.split('/').pop()?.substring(0, 20) + '...' 
                : notice.file_url.split('/').pop()}
              <Download className="h-4 w-4" />
            </Button>
          </a>
        </CardFooter>
      )}
    </Card>
  );
};

export default NoticeCard;
