'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  updateProfile, sendPasswordResetEmail, sendEmailVerification,
  deleteUser, signOut,
} from 'firebase/auth';
import { User, Mail, ShieldCheck, KeyRound, Trash2, Loader2, CheckCircle2, AlertTriangle, LogOut } from 'lucide-react';
import { auth } from '../../../firebase/client';
import { deleteUserData } from '../../actions/interview';
import { getIdToken } from '../../../lib/clientAuth';
import { Button } from '../../../components/ui/button';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [busy, setBusy] = useState('');

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      setName(u?.displayName || '');
    });
    return () => unsub();
  }, []);

  const saveName = async () => {
    if (!name.trim()) { toast.error('Name cannot be empty.'); return; }
    try {
      setSavingName(true);
      await updateProfile(auth.currentUser, { displayName: name.trim() });
      toast.success('Profile updated.');
    } catch (e) {
      toast.error('Could not update profile.');
    } finally {
      setSavingName(false);
    }
  };

  const resetPassword = async () => {
    try {
      setBusy('reset');
      await sendPasswordResetEmail(auth, user.email);
      toast.success('Password reset link sent to your email.');
    } catch (e) {
      toast.error('Could not send reset email.');
    } finally {
      setBusy('');
    }
  };

  const resendVerification = async () => {
    try {
      setBusy('verify');
      await sendEmailVerification(auth.currentUser);
      toast.success('Verification email sent.');
    } catch (e) {
      toast.error('Could not send verification email. Try again later.');
    } finally {
      setBusy('');
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/auth/sign-in');
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete your account and all your interviews and feedback? This cannot be undone.')) return;
    try {
      setBusy('delete');
      const token = await getIdToken();
      await deleteUserData(token);
      await deleteUser(auth.currentUser);
      toast.success('Your account has been deleted.');
      router.push('/');
    } catch (e) {
      if (e.code === 'auth/requires-recent-login') {
        toast.error('Please sign in again, then retry deleting your account.');
        await signOut(auth);
        router.push('/auth/sign-in');
      } else {
        toast.error('Could not delete account. Please try again.');
      }
      setBusy('');
    }
  };

  const initial = (user?.displayName?.[0] || user?.email?.[0] || 'U').toUpperCase();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl uppercase">
            {initial}
          </div>
          <div>
            <p className="font-bold text-gray-900">{user?.displayName || 'Your name'}</p>
            <p className="text-sm text-gray-500">{user?.email || '—'}</p>
          </div>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1.5">Display name</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-11 pr-4 h-11 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Your name"
            />
          </div>
          <Button onClick={saveName} disabled={savingName} className="h-11 bg-primary hover:bg-primary/90 text-white px-6">
            {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
          </Button>
        </div>
      </section>

      {/* Email & verification */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Mail className="w-5 h-5 text-primary" /> Email</h2>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-gray-700">{user?.email || '—'}</p>
            {user && (
              user.emailVerified ? (
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1"><CheckCircle2 className="w-3.5 h-3.5" /> Verified</p>
              ) : (
                <p className="text-xs text-amber-600 flex items-center gap-1 mt-1"><AlertTriangle className="w-3.5 h-3.5" /> Not verified</p>
              )
            )}
          </div>
          {user && !user.emailVerified && (
            <Button variant="outline" onClick={resendVerification} disabled={busy === 'verify'} className="h-10">
              {busy === 'verify' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Resend verification'}
            </Button>
          )}
        </div>
      </section>

      {/* Security */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-bold text-gray-800 mb-2 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Security</h2>
        <p className="text-sm text-gray-500 mb-4">We&apos;ll email you a secure link to set a new password.</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={resetPassword} disabled={busy === 'reset'} className="h-10 gap-2">
            <KeyRound className="w-4 h-4" /> {busy === 'reset' ? 'Sending…' : 'Send password reset link'}
          </Button>
          <Button variant="outline" onClick={handleSignOut} className="h-10 gap-2">
            <LogOut className="w-4 h-4" /> Sign out
          </Button>
        </div>
      </section>

      {/* Danger zone */}
      <section className="bg-red-50 rounded-2xl border border-red-200 p-6">
        <h2 className="font-bold text-red-800 mb-2 flex items-center gap-2"><Trash2 className="w-5 h-5" /> Danger zone</h2>
        <p className="text-sm text-red-700/80 mb-4">
          Permanently delete your account and all your interviews and feedback. This cannot be undone.
        </p>
        <Button onClick={handleDelete} disabled={busy === 'delete'} className="h-10 bg-red-600 hover:bg-red-700 text-white gap-2">
          {busy === 'delete' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Delete my account
        </Button>
      </section>
    </div>
  );
}
