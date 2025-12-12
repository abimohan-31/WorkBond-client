"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on portal pages
  if (
    pathname.startsWith("/customer") ||
    pathname.startsWith("/provider") ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  // Simplified footer for registration pages
  const isRegistrationPage = pathname.startsWith("/register");

  if (isRegistrationPage) {
    return (
      <footer className="border-t bg-background py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} WorkBond. All rights reserved.</p>
        </div>
      </footer>
    );
  }

  // Full footer for public pages
  return (
    <footer className="border-t bg-secondary py-8">
      <div className="container mx-auto px-4" >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 m-5">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">WorkBond</h3>
            <p className="text-sm text-muted-foreground">
              Connecting you with trusted local professionals for all your service needs.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Ukkulankulam, Vavuniya</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span>0704808145</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span>abishamohanathas0431@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-5 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} WorkBond. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
