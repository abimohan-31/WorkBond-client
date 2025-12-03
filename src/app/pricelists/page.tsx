"use client";
import { useEffect, useState } from "react";
import { priceLists } from "@/lib/apiClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function PublicPriceListsPage() {
  const [list, setList] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await priceLists.getAll();
      setList(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load price lists");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">Service Pricing</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {list.map((item: any) => (
          <Card key={item._id} className="hover:shadow-lg transition-shadow">
            <CardHeader><CardTitle>{item.service?.name || "Service"}</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">${item.price}</div>
              <p className="text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
