import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage]   = useState('Loading…');
  const [canReset, setCanReset] = useState(false);

  useEffect(() => {
    const doRecovery = async () => {
      const hash   = window.location.hash.replace(/^#/, '');
      const params = new URLSearchParams(hash);
      const token  = params.get('access_token');

      if (!token) {
        setMessage('Invalid or expired reset link.');
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        type: 'recovery',
        token,
      });
      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage('Please enter your new password:');
      setCanReset(true);
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
    <div className="max-w-md mx-auto p-6">
      <h1>Reset Password</h1>
      <p>{message}</p>
      {canReset && (
        <>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-2 border"
          />
          <button
            onClick={handleReset}
            className="w-full p-2 bg-blue-600 text-white"
          >
            Update Password
          </button>
        </>
      )}
    </div>
  );
}
