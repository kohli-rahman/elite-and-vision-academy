// src/components/Auth.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

import { 
  Mail, Lock, User, Phone, BookOpen, ArrowLeft 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const examOptions = [ /* … */ ];
const classOptions = [ /* … */ ];

export default function Auth() {
  const navigate = useNavigate();

  // Shared form state
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [fullName, setFullName]     = useState('');
  const [phone, setPhone]           = useState('');
  const [selectedClass, setSelectedClass]   = useState('');
  const [selectedExams, setSelectedExams]   = useState<string[]>([]);

  // UI state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [activeTab, setActiveTab]                   = useState<'login'|'register'>('login');

  // ─── 1) LOGIN ────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Logged in successfully');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 2) SIGNUP ───────────────────────────────────────────────────────────────
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;

      // Optionally update profile table
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

      toast.success('Registered! Check your email to confirm.');
      setActiveTab('login');
    } catch (err: any) {
      toast.error(err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 3) FORGOT PASSWORD ───────────────────────────────────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success('Password reset link sent!');
      setShowForgotPassword(false);
      setActiveTab('login');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────

  // 3a) Forgot‑password form
  if (showForgotPassword) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="max-w-md w-full">
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
              <CardTitle>Reset Password</CardTitle>
            </div>
            <CardDescription>
              Enter your email to receive a reset link
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleForgotPassword}>
            <CardContent>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  className="pl-9"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending…' : 'Send Reset Link'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  // 3b) Default: Login / Register tabs
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-md w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>Enter your credentials</CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email"
                    className="pl-9"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
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
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  variant="link"
                  className="w-full text-right p-0 mt-1"
                  onClick={() => setShowForgotPassword(true)}
                  type="button"
                >
                  Forgot your password?
                </Button>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in…' : 'Login'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>Join us today</CardDescription>
            </CardHeader>
            <form onSubmit={handleSignup}>
              <CardContent className="space-y-4">
                {/* Full Name */}
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Full Name"
                    className="pl-9"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                  />
                </div>
                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email"
                    className="pl-9"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                {/* Phone */}
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Phone"
                    className="pl-9"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                  />
                </div>
                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Password"
                    className="pl-9"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
                {/* Class and Exam Buttons… */}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating…' : 'Create account'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
