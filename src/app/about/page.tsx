"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Shield, Zap, Heart, Target, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-muted/30 bg-gradient-to-br from-secondary/40 via-background to-primary/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 ">
        <div className="text-center mb-16 space-y-6 ">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            About WorkBond
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Connecting you with trusted local professionals for all your service
            needs. We bridge the gap between customers seeking quality services
            and skilled professionals ready to deliver exceptional work.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-20">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">For Customers</h3>
              <p className="text-muted-foreground leading-relaxed">
                Browse verified service providers, view their portfolios, read
                reviews, and book services with confidence. Our platform makes
                it easy to find the right professional for your needs.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">For Providers</h3>
              <p className="text-muted-foreground leading-relaxed">
                Showcase your skills, build your portfolio, connect with
                customers, and grow your business. Join our network of trusted
                professionals and expand your reach.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg md:col-span-2 lg:col-span-1">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Trust & Safety</h3>
              <p className="text-muted-foreground leading-relaxed">
                All providers undergo a verification process to ensure quality
                and reliability. Our review system helps maintain high standards
                and builds trust within our community.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12 mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Mission
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                WorkBond is a platform designed to bridge the gap between
                customers seeking quality services and skilled professionals
                ready to deliver exceptional work. We understand that finding
                the right service provider can be challenging, which is why
                we've created a trusted marketplace where connections happen
                seamlessly.
              </p>
              <p>
                Our mission is to empower local professionals while providing
                customers with easy access to verified, experienced service
                providers. Whether you need home repairs, cleaning services, or
                specialized expertise, WorkBond connects you with the right
                professionals in your area.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-20">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-8 pb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To become the leading platform that connects customers with
                    trusted local professionals, fostering a community where
                    quality service and customer satisfaction are the foundation
                    of every interaction.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-8 pb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Community Focus
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We believe in supporting local businesses and building
                    strong community connections. WorkBond is more than a
                    platform—it's a community of professionals and customers
                    working together.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
          <Award className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join WorkBond today and experience the difference. Whether you're
            looking for services or offering them, we're here to help you
            succeed.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="text-base px-8">
              <Link href="/auth/register/customer">Sign Up as Customer</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-base px-8"
            >
              <Link href="/auth/register/provider">Join as Provider</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
