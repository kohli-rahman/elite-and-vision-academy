
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundView = () => {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="text-center">
        <h1 className="heading-lg mb-4">Program Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The program you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/programs" className="btn-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Programs
        </Link>
      </div>
    </div>
  );
};

export default NotFoundView;
