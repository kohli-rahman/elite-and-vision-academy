import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function ResetPassword() {
  const router = useRouter();
  const { query } = router;
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { access_token, refresh_token, type } = query;

    // Only try to set session if this is a recovery (reset password)
    if (type === 'recovery' && access_token && refresh_token) {
      supabase.auth
        .setSession({
          access_token: access_token as string,
          refresh_token: refresh_token as string,
        })
        .then(({ error }) => {
          if (error) {
            setMessage("Session error: " + error.message);
          } else {
            setMessage('Please enter your new password.');
          }
          setLoading(false);
        });
    } else {
      setMessage('Invalid or expired reset link.');
      setLoading(false);
    }
  }, [query]);

  const handleReset = async () => {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password has been updated! Redirecting to login...');
      setTimeout(() => router.push('/login'), 3000);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Reset Password</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginRight: '1rem' }}
          />
          <button onClick={handleReset}>Update Password</button>
          <p>{message}</p>
        </>
      )}
    </div>
  );
}
