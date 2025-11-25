"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="" className="font-bold text-xl">
            <Image
              src="/noBgColor.svg"
              width={200}
              height={150}
              alt="WorkBond Logo"
            />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/become-provider">Join as a Provider</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/auth/register/customer">Sign Up</Link>
          </Button>

          <Button asChild className="justify-start">
            <Link href="/auth/login" onClick={() => setIsOpen(false)}>
              Log In
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
