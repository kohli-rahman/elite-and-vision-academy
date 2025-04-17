useEffect(() => {
  const handleRecovery = async () => {
    const { error } = await supabase.auth.getSessionFromUrl(); // 👈 this sets the session
    
    if (error) {
      setMessage('Invalid or expired reset link.');
      setCanReset(false);
      return;
    }

    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      setMessage('Please enter your new password');
      setCanReset(true);
    } else {
      setMessage('User not found');
      setCanReset(false);
    }
  };

  handleRecovery();
}, []);
