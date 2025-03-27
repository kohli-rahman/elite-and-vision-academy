
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  PlusCircle, Edit, Eye, Clock, BookOpen, 
  CheckCircle, AlertCircle, BarChart 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

// Fetch all tests based on user role
const fetchTests = async () => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    
    // Fetch tests regardless of authentication status
    const { data, error } = await supabase
      .from('tests')
      .select('*, test_attempts(*)');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching tests:', error);
    return [];
  }
};

// Fetch user's attempts for a specific test
const fetchUserAttempts = async (testId: string) => {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('test_attempts')
    .select('*')
    .eq('test_id', testId)
    .eq('student_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

const Tests = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user || null;
      setUser(currentUser);
      
      // Check if user is the specific admin
      setIsAdmin(currentUser?.email === '2201cs58_rahul@iitp.ac.in');
    };
    
    checkUser();
  }, []);

  const { data: tests, isLoading, isError, refetch } = useQuery({
    queryKey: ['tests'],
    queryFn: fetchTests,
    // Always fetch tests, regardless of authentication
    enabled: true,
  });

  // Removed redirect to login since the Tests page is now accessible to all users

  const handleTakeTest = async (testId: string) => {
    // Check if user is authenticated first
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      toast.error('Please log in to take tests');
      navigate('/auth');
      return;
    }
    
    try {
      // Check if user has already attempted this test
      const attempts = await fetchUserAttempts(testId);
      
      if (attempts && attempts.length > 0) {
        const completedAttempt = attempts.find(a => a.status === 'completed');
        
        if (completedAttempt) {
          // User already completed this test
          navigate(`/tests/${testId}/results?attemptId=${completedAttempt.id}`);
          return;
        }
        
        const inProgressAttempt = attempts.find(a => a.status === 'in_progress');
        if (inProgressAttempt) {
          // Continue in-progress attempt
          navigate(`/tests/${testId}/attempt?attemptId=${inProgressAttempt.id}`);
          return;
        }
      }
      
      // Start a new attempt
      const { data: attemptData, error } = await supabase
        .from('test_attempts')
        .insert({
          test_id: testId,
          student_id: user.id,
          status: 'in_progress'
        })
        .select()
        .single();
      
      if (error) {
        toast.error('Failed to start test: ' + error.message);
        return;
      }
      
      navigate(`/tests/${testId}/attempt?attemptId=${attemptData.id}`);
    } catch (error: any) {
      toast.error('Error: ' + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen section-container">
        <div className="text-center py-12">
          <div className="spinner"></div>
          <p className="mt-4 text-muted-foreground">Loading tests...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="pt-24 min-h-screen section-container">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
          <h2 className="mt-4 text-xl font-semibold">Error Loading Tests</h2>
          <p className="mt-2 text-muted-foreground">
            An error occurred while loading tests. Please try again later.
          </p>
          <Button onClick={() => refetch()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen pb-12 section-container">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="heading-lg">Test Center</h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? 'Create and manage your tests for students' 
              : 'Take tests and view your performance'}
          </p>
        </div>
        
        {isAdmin && (
          <Link to="/tests/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Test
            </Button>
          </Link>
        )}
      </div>
      
      {tests && tests.length > 0 ? (
        <div className="glass-card rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.map((test: any) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.title}</TableCell>
                  <TableCell>{test.subject}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      {test.duration} min
                    </div>
                  </TableCell>
                  <TableCell>
                    {isAdmin ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        test.is_published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {test.is_published ? 'Published' : 'Draft'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {isAdmin ? (
                      <>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/tests/${test.id}/edit`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/tests/${test.id}/results`}>
                            <BarChart className="h-4 w-4 mr-1" />
                            Results
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={() => handleTakeTest(test.id)} 
                        size="sm"
                      >
                        <BookOpen className="h-4 w-4 mr-1" />
                        Take Test
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="glass-card p-10 rounded-lg text-center">
          <BookOpen className="h-12 w-12 mx-auto text-primary/60" />
          <h3 className="mt-4 text-lg font-medium">No Tests Available</h3>
          <p className="mt-2 text-muted-foreground">
            {isAdmin 
              ? 'Create your first test to get started!' 
              : 'Check back later for available tests.'}
          </p>
          {isAdmin && (
            <Link to="/tests/create">
              <Button className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Test
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Tests;
