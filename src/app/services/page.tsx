"use client";
import { useEffect, useState } from "react";
import { services } from "@/lib/apiClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function PublicServicesPage() {
  const [serviceList, setServiceList] = useState([]);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const res = await services.getAll();
      setServiceList(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load services");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">Our Services</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {serviceList.map((service: any) => (
          <Card key={service._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-semibold text-primary mb-2">{service.category}</p>
              <p className="text-muted-foreground">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
