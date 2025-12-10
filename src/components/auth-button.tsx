"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <p>{session.user.email}</p>
        <Button variant="link" className="p-0 h-auto text-xs" onClick={() => signOut()}>
          (Sign Out)
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" className="bg-transparent border-neutral-600 text-neutral-400" onClick={() => signIn("google")}>
      Login with Google
    </Button>
  );
}
