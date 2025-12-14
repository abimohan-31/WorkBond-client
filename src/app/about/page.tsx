"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Shield, Zap, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            About WorkBond
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connecting you with trusted local professionals for all your service
            needs
          </p>
        </div>

        <div className="space-y-8 mb-12">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                WorkBond is a platform designed to bridge the gap between
                customers seeking quality services and skilled professionals
                ready to deliver exceptional work. We understand that finding
                the right service provider can be challenging, which is why
                we've created a trusted marketplace where connections happen
                seamlessly.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our mission is to empower local professionals while providing
                customers with easy access to verified, experienced service
                providers. Whether you need home repairs, cleaning services, or
                specialized expertise, WorkBond connects you with the right
                professionals in your area.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-6 w-6 text-primary" />
                  <CardTitle>For Customers</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Browse verified service providers, view their portfolios, read
                  reviews, and book services with confidence. Our platform makes
                  it easy to find the right professional for your needs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="h-6 w-6 text-primary" />
                  <CardTitle>For Providers</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Showcase your skills, build your portfolio, connect with
                  customers, and grow your business. Join our network of trusted
                  professionals and expand your reach.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <CardTitle>Trust & Safety</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All providers undergo a verification process to ensure quality
                  and reliability. Our review system helps maintain high
                  standards and builds trust within our community.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="h-6 w-6 text-primary" />
                  <CardTitle>Community Focus</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We believe in supporting local businesses and building strong
                  community connections. WorkBond is more than a platform—it's a
                  community of professionals and customers working together.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground">
            Join WorkBond today and experience the difference
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/auth/register/customer">Sign Up as Customer</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/register/provider">Join as Provider</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
