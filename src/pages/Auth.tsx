import { useState, useEffect } from 'react';

import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

  // useEffect(() => {
  //   const handlePasswordReset = async () => {
  //     const accessToken = searchParams.get('access_token');
  //     const refreshToken = searchParams.get('refresh_token');
  //     const type = searchParams.get('type');

  //     if (type === 'recovery' && (accessToken || refreshToken)) {
  //       try {
  //         const { error } = await supabase.auth.getSession();

  //         if (!error) {
  //           setShowResetPassword(true);
  //           window.history.replaceState({}, document.title, '/auth');
  //         }
  //       } catch (error) {
  //         console.error('Error checking session for password reset:', error);
  //       }
  //     }
  //   };

  //   handlePasswordReset();
  // }, [searchParams]);

useEffect(() => {
  const handlePasswordReset = async () => {
    // ① extract the token from the URL hash
    const hash = window.location.hash.replace(/^#/, '');
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    const type  = params.get('type');

    // ② validate
    if (type !== 'recovery' || !token) {
      toast.error('Invalid or expired reset link');
      return;
    }

    // ③ consume it in a one‑time recovery session
    const { error: verifyError } = await supabase.auth.verifyOtp({
      type: 'recovery',
      token,
    });
    if (verifyError) {
      toast.error(verifyError.message);
      return;
    }
