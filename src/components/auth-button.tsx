'use client';

import { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from './ui/button';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <p>{user.email}</p>
        <Button variant="link" className="p-0 h-auto text-xs" onClick={handleSignOut}>
          (Sign Out)
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" className="bg-transparent border-neutral-600 text-neutral-400" onClick={handleSignIn}>
      Login with Google
    </Button>
  );
}
