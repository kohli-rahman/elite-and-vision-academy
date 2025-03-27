
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AuthStatus = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);
      
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user || null);
        }
      );
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    checkUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <Button variant="ghost" disabled>
        <User className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden md:inline text-sm text-muted-foreground">
          {user.email}
        </span>
        <Button variant="ghost" onClick={handleSignOut} size="sm">
          <LogOut className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    );
  }

  return (
    <Link to="/auth">
      <Button>
        <LogIn className="h-4 w-4 mr-2" />
        <span>Login</span>
      </Button>
    </Link>
  );
};

export default AuthStatus;
