
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  PlusCircle, Edit, Eye, Clock, BookOpen, 
  CheckCircle, AlertCircle, BarChart, Download, Trash2
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

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
  const [testToDelete, setTestToDelete] = useState<string | null>(null);
  
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
        // Check if there's a completed attempt with student details
        const completedAttempt = attempts.find(a => 
          a.status === 'completed' && 
          a.student_name && 
          a.roll_number
        );
        
        if (completedAttempt) {
          toast.info('You have already completed this test with your details.');
          navigate(`/tests/${testId}/results?attemptId=${completedAttempt.id}`);
          return;
        }
        
        // Check if there are any completed attempts regardless of details
        const anyCompletedAttempt = attempts.find(a => a.status === 'completed');
        if (anyCompletedAttempt) {
          toast.info('You have already completed this test. Viewing your results.');
          navigate(`/tests/${testId}/results?attemptId=${anyCompletedAttempt.id}`);
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
          status: 'in_progress',
          start_time: new Date().toISOString()
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

  const handleViewResults = (testId: string) => {
    navigate(`/tests/${testId}/results`);
  };

  const downloadRankings = async (testId: string, testTitle: string) => {
    try {
      // Fetch all attempts for this test with student details
      const { data: rankings, error } = await supabase
        .from('test_attempts')
        .select('id, student_name, roll_number, score, total_possible, status')
        .eq('test_id', testId)
        .eq('status', 'completed')
        .order('score', { ascending: false });
      
      if (error) {
        throw error;
      }

      if (!rankings || rankings.length === 0) {
        toast.info('No submissions available for this test');
        return;
      }
      
      // Calculate percentage scores and assign ranks
      const formattedRankings = rankings.map((r: any, index: number) => ({
        rank: index + 1,
        name: r.student_name || 'Anonymous',
        roll: r.roll_number || 'N/A',
        score: r.score || 0,
        total: r.total_possible || 0,
        percentage: r.total_possible ? Math.round((r.score / r.total_possible) * 100) : 0
      }));
      
      // Create CSV content
      let csvContent = "Rank,Student Name,Roll Number,Score,Total Marks,Percentage\n";
      formattedRankings.forEach(ranking => {
        csvContent += `${ranking.rank},"${ranking.name}","${ranking.roll}",${ranking.score},${ranking.total},${ranking.percentage}%\n`;
      });
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${testTitle.replace(/\s+/g, '_')}_Rankings.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Rankings downloaded successfully');
    } catch (error: any) {
      toast.error(`Failed to download rankings: ${error.message}`);
    }
  };

  const deleteTest = async (testId: string) => {
    try {
      // Delete all answers for this test's attempts
      const { data: attempts } = await supabase
        .from('test_attempts')
        .select('id')
        .eq('test_id', testId);
      
      if (attempts && attempts.length > 0) {
        const attemptIds = attempts.map(a => a.id);
        
        // Delete test answers
        await supabase
          .from('test_answers')
          .delete()
          .in('attempt_id', attemptIds);
        
        // Delete test attempts
        await supabase
          .from('test_attempts')
          .delete()
          .eq('test_id', testId);
      }
      
      // Delete test questions
      await supabase
        .from('test_questions')
        .delete()
        .eq('test_id', testId);
      
      // Delete the test
      const { error } = await supabase
        .from('tests')
        .delete()
        .eq('id', testId);
      
      if (error) throw error;
      
      setTestToDelete(null);
      refetch();
      toast.success('Test deleted successfully');
    } catch (error: any) {
      toast.error(`Failed to delete test: ${error.message}`);
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
              <PlusCircle className="h-4 w-4 mr-2" />
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
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewResults(test.id)}
                        >
                          <BarChart className="h-4 w-4 mr-1" />
                          Results
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => downloadRankings(test.id, test.title)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Rankings
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200"
                          onClick={() => setTestToDelete(test.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!testToDelete} onOpenChange={(open) => !open && setTestToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Test</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this test? This will permanently remove the test, all questions, and all student attempts. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="button" 
              variant="destructive"
              onClick={() => testToDelete && deleteTest(testToDelete)}
            >
              Delete Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tests;
