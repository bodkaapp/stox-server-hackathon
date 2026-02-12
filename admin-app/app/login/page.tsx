"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useAuth } from "../AuthProvider";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleSignIn = () => {
    signInWithGoogle();
  };

  if (loading || (!loading && user)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="flex flex-col items-center gap-6 rounded-lg bg-white p-8 shadow-md dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold">Admin Login</h1>
        <button
          onClick={handleSignIn}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-white transition-colors hover:bg-blue-700"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
