
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('Loading…');
  const [canReset, setCanReset] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const doRecovery = async () => {
      const hash = window.location.hash.replace(/^#/, '');
      const params = new URLSearchParams(hash);
      const token = params.get('access_token');
      // Get email from URL params or localStorage if available
      const emailParam = params.get('email') || localStorage.getItem('resetEmail');

      if (!token) {
        setMessage('Invalid or expired reset link.');
        return;
      }

      if (emailParam) {
        setEmail(emailParam);
      } else {
        setMessage('Email address is missing. Please start the password reset process again.');
        return;
      }

      try {
        // Updated to use email with token for verification
        const { error } = await supabase.auth.verifyOtp({
          type: 'recovery',
          token,
          email: emailParam,
        });
        
        if (error) {
          setMessage(error.message);
          return;
        }

        setMessage('Please enter your new password:');
        setCanReset(true);
      } catch (error) {
        console.error('Verification error:', error);
        setMessage('An error occurred during verification. Please try again.');
      }
    };

    doRecovery();
  }, []);

  const handleReset = async () => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('✅ Password updated! Redirecting to login…');
      setTimeout(() => navigate('/auth'), 3000);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 pt-16">
      <Card>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        
        {canReset && (
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        )}
        
        {canReset && (
          <CardFooter>
            <Button
              onClick={handleReset}
              className="w-full"
            >
              Update Password
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
