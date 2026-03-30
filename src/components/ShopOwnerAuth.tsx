import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Loader2, Eye, EyeOff, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ShopOwnerAuth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setNeedsConfirmation(false);

    try {
      const trimmedEmail = email.trim();
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        
        setMessage('Success! Check your email for the confirmation link.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      let errorMessage = err.message || 'An error occurred during authentication.';
      
      if (errorMessage.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials or sign up for a new account.';
      } else if (errorMessage.toLowerCase().includes('rate limit')) {
        errorMessage = 'Too many requests! Please wait about 60 seconds before trying again.';
      }
      
      setError(errorMessage);
      
      if (err.status === 403 || errorMessage.toLowerCase().includes('email not confirmed')) {
        setNeedsConfirmation(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmation = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: 'https://ais-dev-rlg5ackaaz7vkdkhkmgds2-175940048257.europe-west2.run.app',
        },
      });
      if (error) throw error;
      setMessage('Confirmation email resent! Please check your inbox.');
      setNeedsConfirmation(false);
    } catch (err: any) {
      setError(err.message || 'Failed to resend confirmation email.');
    } finally {
      setLoading(false);
    }
  };

  if (session) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-6 bg-white rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome, {session.user.email}!
          </h2>
          <p className="text-slate-500 text-lg">
            You can now manage your inventory.
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="mt-6 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
      <div className="text-center mb-8 flex flex-col items-center">
        <img 
          src="https://i.imgur.com/zpJPuWC.png" 
          alt="Al Moneer Opticals" 
          className="h-20 w-auto object-contain mb-4" 
          referrerPolicy="no-referrer" 
        />
        <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Al Moneer</h2>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Opticals</span>
        <span className="text-lg font-bold text-slate-700 mt-1">المنير للبصريات</span>
        <div className="h-px w-12 bg-slate-200 my-4" />
        <h2 className="text-xl font-bold text-slate-900">Shop Owner Portal</h2>
        <p className="text-slate-500 mt-1 text-sm">Manage your Al Moneer inventory</p>
      </div>

      <form className="space-y-5" onSubmit={handleAuth}>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
          <div className="relative">
            <input
              type="email"
              placeholder="owner@almoneer.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
            />
            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full pl-4 pr-11 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3.5 rounded-xl border border-red-100 flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p>{error}</p>
              {needsConfirmation && (
                <button
                  type="button"
                  onClick={resendConfirmation}
                  className="mt-2 text-sm font-bold text-red-700 hover:text-red-800 underline decoration-red-300 underline-offset-2"
                >
                  Resend Confirmation Email
                </button>
              )}
            </div>
          </div>
        )}
        
        {message && (
          <div className="text-sm text-emerald-600 bg-emerald-50 p-3.5 rounded-xl border border-emerald-100 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p>{message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-md text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Create Account' : 'Sign In')}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
            setMessage(null);
            setNeedsConfirmation(false);
          }}
          className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          {isSignUp ? 'Already have an account? Sign in' : "Need an account? Sign up"}
        </button>
      </div>
    </div>
  );
}
