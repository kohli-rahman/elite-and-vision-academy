import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Phone, BookOpen, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const examOptions = [
  { value: 'Board Exams', label: 'Board Exams' },
  { value: 'NTSE', label: 'NTSE' },
  { value: 'IIT-JEE', label: 'IIT-JEE' },
  { value: 'NEET', label: 'NEET' },
  { value: 'Olympiads', label: 'Olympiads' }
];

const classOptions = [
  { value: '9', label: 'Class 9' },
  { value: '10', label: 'Class 10' },
  { value: '11', label: 'Class 11' },
  { value: '12', label: 'Class 12' }
];

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    const handlePasswordReset = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const type = searchParams.get('type');
      
      if (type === 'recovery' && (accessToken || refreshToken)) {
        try {
          const { error } = await supabase.auth.getSession();
          
          if (!error) {
            setShowResetPassword(true);
            window.history.replaceState({}, document.title, '/auth');
          }
        } catch (error) {
          console.error('Error checking session for password reset:', error);
        }
      }
    };
    
    handlePasswordReset();
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/');
      toast.success('Logged in successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            class: selectedClass,
            exam_interest: selectedExams,
            phone,
          })
          .eq('id', user.id);

        if (profileError) throw profileError;
      }

      toast.success('Registered successfully! Please verify your email.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      toast.success('Password reset link sent to your email');
      setShowForgotPassword(false);
      setActiveTab('login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset password email');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) throw error;
      
      toast.success('Password updated successfully');
      setShowResetPassword(false);
      setActiveTab('login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExam = (exam: string) => {
    setSelectedExams(prev => 
      prev.includes(exam) 
        ? prev.filter(e => e !== exam) 
        : [...prev, exam]
    );
  };

  if (showResetPassword) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Reset Your Password</CardTitle>
            <CardDescription>
              Please enter a new password for your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handlePasswordReset}>
            <CardContent className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="password" 
                  placeholder="New Password" 
                  className="pl-9" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="password" 
                  placeholder="Confirm New Password" 
                  className="pl-9" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  if (showForgotPassword) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center mb-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowForgotPassword(false)}
                className="p-0 mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-2xl">Reset Password</CardTitle>
            </div>
            <CardDescription>
              Enter your email and we'll send you a password reset link
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleForgotPassword}>
            <CardContent className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="email" 
                  placeholder="Email" 
                  className="pl-9" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-12">
      <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="email" 
                      placeholder="Email" 
                      className="pl-9" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="password" 
                      placeholder="Password" 
                      className="pl-9" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    variant="link" 
                    className="text-xs p-0 h-auto font-normal text-right w-full"
                    onClick={() => setShowForgotPassword(true)}
                    type="button"
                  >
                    Forgot your password?
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create an account</CardTitle>
              <CardDescription>
                Join our coaching program for board exams and competitive preparation
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSignup}>
              <CardContent className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Full Name" 
                    className="pl-9" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="Email" 
                    className="pl-9" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="pl-9" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="password" 
                    placeholder="Password" 
                    className="pl-9" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Select your class</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {classOptions.map(option => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={selectedClass === option.value ? "default" : "outline"}
                        onClick={() => setSelectedClass(option.value)}
                        className="justify-start"
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Exams you're interested in</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {examOptions.map(option => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={selectedExams.includes(option.value) ? "default" : "outline"}
                        onClick={() => toggleExam(option.value)}
                        className="justify-start"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
