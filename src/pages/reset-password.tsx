import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient'; // adjust path if needed

export default function ResetPassword() {
  const router = useRouter();
  const { query } = router;
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (query.type === 'recovery' && query.access_token) {
      // Supabase automatically logs the user in
      setMessage('Please enter your new password');
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
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginRight: '1rem' }}
      />
      <button onClick={handleReset}>Update Password</button>
      <p>{message}</p>
    </div>
  );
}
