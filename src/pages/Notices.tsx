
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import NoticeCard from "@/components/NoticeCard";
import NoticeForm from "@/components/NoticeForm";
import { fetchNotices, deleteNotice } from "@/services/noticeService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Notice } from "@/types/notice";

const Notices = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Check if the user is an admin (email is the specific admin email)
        setIsAdmin(session.user.email === '2201cs58_rahul@iitp.ac.in');
      } else {
        setIsAdmin(false);
      }
    };
    
    checkSession();
  }, []);

  const { data: notices, isLoading, refetch } = useQuery({
    queryKey: ["notices"],
    queryFn: () => fetchNotices(),
  });

  const handleNoticeSuccess = () => {
    setDialogOpen(false);
    refetch();
  };

  const handleDeleteClick = (notice: Notice) => {
    setNoticeToDelete(notice);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!noticeToDelete) return;
    
    try {
      await deleteNotice(noticeToDelete.id);
      toast.success("Notice deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting notice:", error);
      toast.error("Failed to delete notice");
    } finally {
      setDeleteDialogOpen(false);
      setNoticeToDelete(null);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <section className="py-12 bg-gradient-hero">
        <div className="section-container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <span className="edu-badge mb-2">Stay Updated</span>
              <h1 className="heading-lg mt-2">Notice Board</h1>
            </div>
            {isAdmin && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-4 md:mt-0 bg-educational-primary hover:bg-educational-primary/90">Add New Notice</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] border-educational-primary">
                  <DialogHeader>
                    <DialogTitle className="text-educational-dark">Create New Notice</DialogTitle>
                  </DialogHeader>
                  <NoticeForm onSuccess={handleNoticeSuccess} />
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-6 mt-8">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-white/50 rounded-xl animate-pulse"></div>
              ))
            ) : notices && notices.length > 0 ? (
              notices.map((notice) => (
                <div key={notice.id} className="relative">
                  <NoticeCard notice={notice} />
                  {isAdmin && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="absolute top-4 right-4"
                      onClick={() => handleDeleteClick(notice)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-education">
                <Bell className="mx-auto h-12 w-12 text-educational-muted opacity-20" />
                <h3 className="mt-4 text-lg font-medium text-educational-dark">No Notices Available</h3>
                <p className="text-muted-foreground mt-2">
                  Check back later for updates and announcements.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this notice? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Notices;
