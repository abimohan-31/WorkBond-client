"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { serviceService } from "@/services/service.service";
import { providerService } from "@/services/provider.service";
import { toast } from "sonner";
import { ProviderDetailsModal } from "@/components/modals/ProviderDetailsModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Briefcase } from "lucide-react";

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

export default function ServiceProvidersPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const serviceId = params.id as string;

  const [service, setService] = useState<any>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "customer") {
      router.push("/auth/login");
      return;
    }
    fetchData();
  }, [serviceId, user, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [serviceRes, providersRes] = await Promise.all([
        serviceService.getById(serviceId),
        serviceService.getProviders(serviceId),
      ]);

      if (serviceRes.success) {
        setService(serviceRes.data);
      }

      if (providersRes.success && providersRes.data?.providers) {
        setProviders(providersRes.data.providers);
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load providers");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (provider: Provider) => {
    setSelectedProvider(provider);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading providers...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">
            Providers for {service?.name || "Service"}
          </h1>
          <p className="text-muted-foreground">
            Browse providers offering this service
          </p>
        </div>

        {providers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                No providers available for this service yet
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
              <Card key={provider._id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={provider.profileImage}
                        alt={provider.name}
                      />
                      <AvatarFallback className="text-xl">
                        {provider.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {provider.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 flex-wrap">
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
                            <span className="font-semibold">
                              {provider.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span>{provider.address}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4 mt-0.5" />
                    <span>{provider.experience_years} years experience</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {provider.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {provider.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{provider.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleViewDetails(provider)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ProviderDetailsModal
        provider={selectedProvider}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

