
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import NoticeCard from "./NoticeCard";
import { fetchNotices } from "@/services/noticeService";

const NoticeBoard = () => {
  const { data: notices, isLoading } = useQuery({
    queryKey: ["notices", 3],
    queryFn: () => fetchNotices(3),
  });

  if (isLoading) {
    return (
      <div className="glass-card p-8 rounded-xl animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bell className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-lg font-medium">Notice Board</h3>
        </div>
        <Link to="/notices" className="text-primary hover:underline flex items-center gap-1 text-sm">
          View All Notices <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      
      <div className="space-y-4">
        {notices && notices.length > 0 ? (
          notices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))
        ) : (
          <p className="text-center text-muted-foreground py-6">No notices available.</p>
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;
