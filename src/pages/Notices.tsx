
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import NoticeCard from "@/components/NoticeCard";
import NoticeForm from "@/components/NoticeForm";
import { fetchNotices } from "@/services/noticeService";
import { supabase } from "@/integrations/supabase/client";

const Notices = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // In a real application, you would check if the user has admin privileges
      // For now, we'll assume any authenticated user is an admin
      setIsAdmin(!!session);
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

  return (
    <div className="min-h-screen pt-16">
      <section className="py-12 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="section-container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Stay Updated</span>
              <h1 className="heading-lg mt-2">Notice Board</h1>
            </div>
            {isAdmin && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-4 md:mt-0">Add New Notice</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Notice</DialogTitle>
                  </DialogHeader>
                  <NoticeForm onSuccess={handleNoticeSuccess} />
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-6 mt-8">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
              ))
            ) : notices && notices.length > 0 ? (
              notices.map((notice) => (
                <NoticeCard key={notice.id} notice={notice} />
              ))
            ) : (
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-medium">No Notices Available</h3>
                <p className="text-muted-foreground mt-2">
                  Check back later for updates and announcements.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Notices;
