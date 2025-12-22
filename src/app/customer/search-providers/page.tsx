"use client";

import { useState, useEffect } from "react";
import { providerService } from "@/services/provider.service";
import { ProviderType } from "@/types/provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SearchProvidersPage() {
  const [providers, setProviders] = useState<ProviderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [skills, setSkills] = useState("");

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const response = await providerService.getAllProviders({
        q: search,
        skills: skills,
      });
      if (response.success) {
        setProviders(response.data.providers);
      }
    } catch (error) {
      console.error("Failed to fetch providers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProviders();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">Find Providers</h1>
          <p className="text-muted-foreground mt-2">
            Search for skilled providers by name or skills.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 space-y-2">
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex-1 space-y-2">
            <Input
              placeholder="Filter by skills (e.g. Plumbing, Electrical)..."
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </form>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse h-[300px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.length > 0 ? (
              providers.map((provider) => (
                <Card key={provider._id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 text-black">
                        <AvatarImage src={provider.profileImage} alt={provider.name} />
                        <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{provider.name}</CardTitle>
                        <CardDescription>{provider.email}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex flex-wrap gap-2 mt-2">
                      {provider.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    {provider.address && (
                      <p className="text-sm text-muted-foreground mt-4">
                        📍 {provider.address}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter border-t>
                    <Link href={`/customer/search-providers/${provider._id}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No providers found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
