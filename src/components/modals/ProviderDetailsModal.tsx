"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Briefcase, Star, CheckCircle } from "lucide-react";

interface Provider {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  experience_years: number;
  skills: string[];
  availability_status: string;
  profileImage?: string;
  rating?: number;
}

interface ProviderDetailsModalProps {
  provider: Provider | null;
  open: boolean;
  onClose: () => void;
}

export function ProviderDetailsModal({
  provider,
  open,
  onClose,
}: ProviderDetailsModalProps) {
  if (!provider) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Provider Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={provider.profileImage} alt={provider.name} />
              <AvatarFallback className="text-2xl">
                {provider.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{provider.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    provider.availability_status === "Available"
                      ? "default"
                      : "secondary"
                  }
                >
                  {provider.availability_status}
                </Badge>
                {provider.rating && (
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{provider.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{provider.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{provider.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{provider.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="font-medium">{provider.experience_years} years</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {provider.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
