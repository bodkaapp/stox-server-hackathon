"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { useAuth } from "./AuthProvider";
import { auth } from "./firebase";

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="bg-white dark:bg-black shadow-md">
      <nav className="container mx-auto flex max-w-3xl items-center justify-between p-4">
        <Link href="/" className="text-lg font-bold">
          Admin Dashboard
        </Link>
        <div className="flex items-center gap-4">
          {!loading && user && (
            <>
              {user.photoURL && (
                <Image
                  src={user.photoURL}
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span className="text-sm hidden sm:block">{user.displayName || user.email}</span>
              <button
                onClick={() => signOut(auth)}
                className="h-10 rounded-md bg-zinc-200 px-4 text-sm font-medium text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
