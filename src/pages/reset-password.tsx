import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const access_token = hashParams.get("access_token");
    const refresh_token = hashParams.get("refresh_token");
    const type = hashParams.get("type");

    if (type === 'recovery' && access_token && refresh_token) {
      supabase.auth.setSession({
        access_token,
        refresh_token,
      }).then(({ error }) => {
        if (error) {
          setMessage("Session error: " + error.message);
        } else {
          setMessage("Please enter your new password.");
        }
        setLoading(false);
      });
    } else {
      setMessage("Invalid or expired reset link.");
      setLoading(false);
    }
  }, []);

  const handleReset = async () => {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated! Redirecting to login...");
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
