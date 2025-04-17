// src/components/Auth.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Lock, User, Phone, BookOpen, ArrowLeft } from 'lucide-react';
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
  const [searchParams] = useSearchParams();

  // form state
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExams, setSelectedExams] = useState<string[]>([]);

  // UI state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'login'|'register'>('login');

  // ─── 1) RECOVERY FLOW ───────────────────────────────────────────────────────
  // Runs once on mount. Parses the #access_token=…&type=recovery hash, 
  // calls verifyOtp(), then shows the reset-password form.
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    const type  = params.get('type');

    if (type === 'recovery' && token) {
      supabase.auth
        .verifyOtp({ type: 'recovery', token })
        .then(({ error }) => {
          if (error) {
            toast.error(error.message);
          } else {
            setShowResetPassword(true);
            // rewrite to clean URL so React‑Router matches /reset-password
            window.history.replaceState({}, document.title, '/reset-password');
          }
        });
    }
  }, []);

  // ─── 2) LOGIN ────────────────────────────────────────────────────────────────
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

  // ─── 3) SIGNUP ───────────────────────────────────────────────────────────────
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ class: selectedClass, exam_interest: selectedExams, phone })
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

  // ─── 4) FORGOT PASSWORD ───────────────────────────────────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://elite-and-vision-academy.vercel.app/reset-password',
      });
      if (error) throw error;
      toast.success('Reset link sent to your email');
      setShowForgotPassword(false);
      setActiveTab('login');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 5) RESET PASSWORD SUBMIT ─────────────────────────────────────────────────
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Password updated! Please login.');
      setShowResetPassword(false);
      setActiveTab('login');
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── RENDERING ────────────────────────────────────────────────────────────────
  if (showResetPassword) {
    return (
      <CenterCard>
        <CardTitle>Reset Your Password</CardTitle>
        <form onSubmit={handlePasswordReset}>
          <CardContent>
            <LockedInput 
              placeholder="New Password" 
              value={newPassword}       
              onChange={e => setNewPassword(e.target.value)} 
            />
            <LockedInput 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating…' : 'Update Password'}
            </Button>
          </CardFooter>
        </form>
      </CenterCard>
    );
  }

  if (showForgotPassword) {
    return (
      <CenterCard>
        <CardTitle>Forgot Password</CardTitle>
        <form onSubmit={handleForgotPassword}>
          <CardContent>
            <MailInput 
              placeholder="Your Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Sending…' : 'Send Reset Link'}
            </Button>
          </CardFooter>
        </form>
      </CenterCard>
    );
  }

  // default: login / register tabs…
  return (
    <CenteredTabs
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogin={handleLogin}
      onSignup={handleSignup}
      /* …pass down email, password, fullName, etc. */
    />
  );
}
