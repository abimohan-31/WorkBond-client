import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  backgroundImage?: string;
  sideImage?: string;
  className?: string;
  children?: React.ReactNode;
}

export function HeroSection({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  backgroundImage,
  className,
  children,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-[480px] sm:min-h-[560px] md:min-h-[700px] items-center justify-center w-full overflow-hidden",
        className
      )}
    >
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </>
      )}

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-card/40 backdrop-blur-sm border-border/50 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <CardContent className="p-6 sm:p-8 md:p-12 space-y-5 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-secondary">
                {title}
              </h1>

              {subtitle && (
                <p className="text-base sm:text-lg md:text-xl text-muted max-w-2xl">
                  {subtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 pt-4">
                {primaryAction && (
                  <Button
                    asChild
                    size="lg"
                    className="h-12 px-8 text-lg rounded-full"
                  >
                    <Link href={primaryAction.href}>{primaryAction.label}</Link>
                  </Button>
                )}

                {secondaryAction && (
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 text-lg rounded-full"
                  >
                    <Link href={secondaryAction.href}>
                      {secondaryAction.label}
                    </Link>
                  </Button>
                )}
              </div>

              {children}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
