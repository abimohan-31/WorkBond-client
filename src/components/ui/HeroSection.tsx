import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
            <Button asChild size="lg" className="h-12 px-8 text-lg rounded-full">
              <Link href={primaryAction.href}>{primaryAction.label}</Link>
            </Button>
          )}
          
          {secondaryAction && (
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full">
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}
