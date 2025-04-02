
import React from 'react';
import { Link } from 'react-router-dom';
import ContactForm from '@/components/ContactForm';

interface EnrollmentSidebarProps {
  programTitle: string;
}

const EnrollmentSidebar = ({ programTitle }: EnrollmentSidebarProps) => {
  return (
    <div>
      <div className="glass-card p-6 rounded-xl mb-6">
        <h3 className="text-xl font-semibold mb-4">Enroll in This Program</h3>
        <p className="text-muted-foreground mb-6">
          Ready to take the next step? Enroll in our {programTitle} today and start your journey towards excellence.
        </p>
        <Link to="/admission" className="btn-primary w-full">
          Enroll Now
        </Link>
      </div>
      
      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4">Have Questions?</h3>
        <p className="text-muted-foreground mb-6">
          Contact us for more information about this program or to schedule a consultation with one of our expert instructors.
        </p>
        <ContactForm />
      </div>
    </div>
  );
};

export default EnrollmentSidebar;
