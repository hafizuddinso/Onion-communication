(function () {
  'use strict';
  const cfg = window.OC_CONFIG || {};
  if (!window.supabase || !cfg.SUPABASE_URL || !cfg.SUPABASE_PUBLISHABLE_KEY) {
    console.error('Supabase client configuration is missing.');
    return;
  }
  const client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  window.ocSupabase = client;

  async function mirrorSession(session) {
    if (!session || !session.user) {
      localStorage.removeItem('oc_token');
      localStorage.removeItem('oc_user');
      localStorage.removeItem('oc_email');
      return null;
    }
    const u = session.user;
    let username = (u.user_metadata && u.user_metadata.username) || (u.email ? u.email.split('@')[0] : 'researcher');
    try {
      const { data } = await client.from('profiles').select('username').eq('id', u.id).maybeSingle();
      if (data && data.username) username = data.username;
    } catch (_) {}
    localStorage.setItem('oc_token', session.access_token);
    localStorage.setItem('oc_user', username);
    localStorage.setItem('oc_email', u.email || '');
    return { id: u.id, name: username, email: u.email || '', session };
  }

  window.OCAuth = {
    client,
    async currentUser() {
      const { data: { session } } = await client.auth.getSession();
      return mirrorSession(session);
    },
    async signup(name, email, password) {
      name = String(name || '').trim();
      email = String(email || '').trim().toLowerCase();
      password = String(password || '');
      if (name.length < 2) throw new Error('Enter a name with at least 2 characters.');
      if (password.length < 8) throw new Error('Use at least 8 characters for the password.');
      const { data, error } = await client.auth.signUp({ email, password, options: { data: { username: name } } });
      if (error) throw error;
      if (data.session) await mirrorSession(data.session);
      return data;
    },
    async signin(email, password) {
      const { data, error } = await client.auth.signInWithPassword({ email: String(email || '').trim().toLowerCase(), password: String(password || '') });
      if (error) throw error;
      await mirrorSession(data.session);
      return data;
    },
    async logout() {
      await client.auth.signOut();
      await mirrorSession(null);
      location.href = '/login';
    },
    async requireUser() {
      const user = await this.currentUser();
      if (!user) { location.href = '/login'; return null; }
      return user;
    }
  };

  client.auth.onAuthStateChange((_event, session) => { setTimeout(() => mirrorSession(session), 0); });
})();
