import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  sideImage,
  className,
  children,
}: HeroSectionProps) {
  if (sideImage) {
    return (
      <section
        className={cn(
          "relative flex min-h-[500px] items-center justify-center",
          "bg-gradient-to-br from-primary/10 via-background to-secondary/10",
          className
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 animate-in fade-in slide-in-from-left duration-1000">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block text-foreground">{title}</span>
              </h1>

              {subtitle && (
                <p className="text-lg text-muted-foreground sm:text-xl max-w-xl">
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
            </div>

            <div className="relative w-full h-[400px] lg:h-[500px] rounded-lg overflow-hidden animate-in fade-in slide-in-from-right duration-1000">
              <Image
                src={sideImage}
                alt="Professional handshake"
                fill
                className="object-cover grayscale"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "relative flex min-h-[500px] flex-col items-center justify-center text-center px-4 py-20",
        "bg-gradient-to-br from-primary/10 via-background to-secondary/10",
        className
      )}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      )}

      <div className="relative z-10 max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="block text-foreground">{title}</span>
        </h1>

        {subtitle && (
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {subtitle}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
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
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}
