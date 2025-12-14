"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on portal pages
  if (
    pathname.startsWith("/customer") ||
    pathname.startsWith("/provider") ||
    pathname.startsWith("/workbond/admin")
  ) {
    return null;
  }

  // Simplified footer for registration pages
  const isRegistrationPage = pathname.startsWith("/register");

  if (isRegistrationPage) {
    return (
      <footer className="border-t bg-background py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} WorkBond. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }

  // Full footer for public pages
  return (
    <footer className="border-t bg-secondary py-6 md:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16 mb-6 md:mb-8">
          <div className="space-y-3 md:space-y-4">
            <Image
              src="/noBgWhite.svg"
              width={200}
              height={100}
              alt="WorkBond Logo"
              className="w-40 md:w-48 lg:w-52 h-auto"
            />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting you with trusted local professionals for all your
              service needs.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-background text-base md:text-lg">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-muted-foreground hover:text-foreground transition-colors inline-block"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors inline-block"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-background text-base md:text-lg">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors inline-block"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <h3 className="font-semibold mb-3 md:mb-4 text-background text-base md:text-lg">
                Contact Us
              </h3>
            </Link>
            <ul className="space-y-2 md:space-y-3 text-sm">
              <li className="flex items-start gap-2 md:gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span className="break-words">Ukkulankulam, Vavuniya</span>
              </li>

              <li className="flex items-start gap-2 md:gap-3 text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                <span className="break-all">abimohanuki@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-4 md:pt-5 text-center text-xs md:text-sm text-muted">
          <p>
            &copy; {new Date().getFullYear()} WorkBond. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
