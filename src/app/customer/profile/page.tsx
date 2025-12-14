"use client";
import { useEffect, useState } from "react";
import { customerService } from "@/services/customer.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import CloudinaryImageUpload from "@/components/CloudinaryImageUpload";

export default function CustomerProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user?.role === "customer") loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      const res = await customerService.getProfile();
      setProfile(res.data?.customer || null);
    } catch (err) {
      toast.error("Failed to load profile");
    }
  };

  const handleUpdate = async () => {
    try {
      await customerService.updateProfile(profile);
      await refreshUser();
      toast.success("Profile updated");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const handleImageUpdate = async (url: string) => {
    try {
      await customerService.updateProfile({ ...profile, profileImage: url });
      setProfile((prev: any) => ({ ...prev, profileImage: url }));
      await refreshUser();
      toast.success("Profile image updated");
    } catch (err) {
      toast.error("Failed to update profile image");
    }
  };

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <div className="space-y-4 p-6 border rounded-lg bg-card">
        
        <div className="flex justify-center mb-6">
          <CloudinaryImageUpload
            currentImageUrl={profile.profileImage}
            onUploadSuccess={handleImageUpdate}
            disabled={!isEditing}
          />
        </div>

        <div className="grid gap-2">
            <label className="text-sm font-medium">Name</label>
            <Input disabled={!isEditing} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
        </div>
        <div className="grid gap-2">
            <label className="text-sm font-medium">Email</label>
            <Input disabled value={profile.email} />
        </div>
        <div className="grid gap-2">
            <label className="text-sm font-medium">Phone</label>
            <Input disabled={!isEditing} value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
        </div>
        <div className="grid gap-2">
            <label className="text-sm font-medium">Address</label>
            <Input disabled={!isEditing} value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
        </div>
        
        <div className="flex justify-end gap-4 mt-6">
            {isEditing ? (
                <>
                    <Button variant="outline" onClick={() => { setIsEditing(false); loadProfile(); }}>Cancel</Button>
                    <Button onClick={handleUpdate}>Save Changes</Button>
                </>
            ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
        </div>
      </div>
    </div>
  );
}
