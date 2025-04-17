useEffect(() => {
  const handleRecovery = async () => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace('#', ''));
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (!access_token || !refresh_token) {
      setMessage('Invalid or expired reset link.');
      setCanReset(false);
      return;
    }

    const { error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (sessionError) {
      setMessage('Session error. Please try again.');
      setCanReset(false);
      return;
    }

    const { data, error: userError } = await supabase.auth.getUser();
    if (userError || !data?.user) {
      setMessage('User not found');
      setCanReset(false);
      return;
    }

    setMessage('Please enter your new password');
    setCanReset(true);
  };

  handleRecovery();
}, []);
