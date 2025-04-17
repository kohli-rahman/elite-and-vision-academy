// pages/reset-password.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('Loading…');
  const [canReset, setCanReset] = useState(false);

  useEffect(() => {
    const doRecovery = async () => {
      // 1️⃣ pull the token out of the URL fragment
      const hash = window.location.hash.replace(/^#/, '');
      const params = new URLSearchParams(hash);
      const token = params.get('access_token');

      if (!token) {
        setMessage('Invalid reset link.');
        return;
      }

      // 2️⃣ tell Supabase to verify that recovery‑token
      const { error: verifyError } = await supabase.auth.verifyOtp({
        type: 'recovery',
        token,
      });

      if (verifyError) {
        setMessage(verifyError.message);
        return;
      }

      // 3️⃣ if that succeeded, user is now “logged in” under a recovery session
      setMessage('Please enter your new password:');
      setCanReset(true);
    };

    doRecovery();
  }, []);

  const handleReset = async () => {
    // 4️⃣ swap in their new password
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('✅ Password updated! Redirecting to login…');
      setTimeout(() => router.push('/login'), 3000);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '4rem auto', textAlign: 'center' }}>
      <h1>Reset Password</h1>
      <p>{message}</p>

      {canReset && (
        <>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
          <button
            onClick={handleReset}
            style={{ width: '100%', padding: '0.75rem' }}
          >
            Update Password
          </button>
        </>
      )}
    </div>
  );
}
